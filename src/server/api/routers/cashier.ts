import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { createTRPCRouter, cashierProcedure } from "../trpc";

export const cashierRouter = createTRPCRouter({
  getsMenu: cashierProcedure.query(async ({ ctx }) => {
    //get all products
    const products = await ctx.prisma.menu.findMany();
    return products;
  }),
  getsTable: cashierProcedure.query(async ({ ctx }) => {
    //get all available tables
    const tables = await ctx.prisma.table.findMany({
      where: {
        status: "AVAILABLE",
      },
    });

    return tables;
  }),
  getTransaction: cashierProcedure.query(async ({ ctx }) => {
    const transactions = await ctx.prisma.transactionDetail.findMany({
      where: {
        transaction: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },

      include: {
        transaction: {
          select: {
            id: true,
            quantity: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return transactions;
  }),
  getDetailTransactionById: cashierProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const transaction = await ctx.prisma.transactionDetail.findUnique({
        where: {
          id,
        },
        include: {
          transaction: {
            select: {
              id: true,
              quantity: true,
              customerName: true,
              menu: {
                select: {
                  name: true,
                  price: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      return transaction;
    }),
  createOrder: cashierProcedure
    .input(
      z.object({
        customerName: z.string(),
        tableId: z.string(),
        total: z.number(),
        items: z.array(
          z.object({
            menuId: z.string(),
            quantity: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { customerName, tableId, items, total } = input;
      const transactionNumber = `${"order-" + uuidv4().slice(0, 8)}`;
      const { id } = await ctx.prisma.transactionDetail.create({
        data: {
          transactionNumber,
          total,
        },
      });

      items.forEach(async (item) => {
        await ctx.prisma.$transaction([
          ctx.prisma.transaction.create({
            data: {
              customerName,
              tableId,
              menuId: item.menuId,
              userId: ctx.session.user.id,
              quantity: item.quantity,
              transactionDetailId: id,
            },
          }),

          ctx.prisma.table.update({
            where: {
              id: tableId,
            },
            data: {
              status: "OCCUPIED",
            },
          }),
        ]);
      });
    }),
});
