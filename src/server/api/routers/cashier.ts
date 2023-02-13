import { z } from "zod";

import { createTRPCRouter, publicProcedure, cashierProcedure } from "../trpc";

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
  getTotal: cashierProcedure
    .input(
      z.object({
        tableId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      //get total of transactions by transaction id
    }),

  createOrder: cashierProcedure
    .input(
      z.object({
        customerName: z.string(),
        tableId: z.string(),
        items: z.array(
          z.object({
            menuId: z.string(),
            quantity: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { customerName, tableId, items } = input;
      //loop through items and create transaction
      items.forEach(async (item) => {
        await ctx.prisma.$transaction([
          ctx.prisma.transaction.create({
            data: {
              customerName,
              tableId,
              menuId: item.menuId,
              userId: ctx.session.user.id,
              quantity: item.quantity,
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
