import { z } from "zod";

import { createTRPCRouter, managerProcedure } from "../trpc";

export const managerRouter = createTRPCRouter({
  getTransaction: managerProcedure
    .input(
      z.object({
        date: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { date } = input;

      const transactions = await ctx.prisma.transactionDetail.findMany({
        include: {
          transaction: {
            select: {
              id: true,
              quantity: true,
              createdAt: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        where: {
          transaction: {
            some: {
              createdAt: {
                gte: date ? date?.slice(0, 10) + "T00:00:00.000Z" : undefined,
                lte: date ? date?.slice(0, 10) + "T23:59:59.999Z" : undefined,
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      return transactions;
    }),

  getStatistic: managerProcedure
    .input(
      z.object({
        date: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { date } = input;
      const popularMenus = await ctx.prisma.transaction.groupBy({
        by: ["menuId"],
        _sum: {
          quantity: true,
        },
        where: {
          createdAt: {
            gte: date ? date?.slice(0, 10) + "T00:00:00.000Z" : undefined,
            lte: date ? date?.slice(0, 10) + "T23:59:59.999Z" : undefined,
          },
        },
      });

      const transactionCreatedAt = await ctx.prisma.transaction.findMany({
        select: {
          createdAt: true,
          quantity: true,
        },
      });

      const popularMenuName = await Promise.all(
        popularMenus.map(async (menu) => {
          const menuName = await ctx.prisma.menu.findUnique({
            where: {
              id: menu.menuId,
            },
          });
          return menuName;
        })
      );
      return popularMenuName.map((menu, index) => {
        return {
          name: menu?.name,
          quantity: popularMenus?.[index]?._sum.quantity,
          createdAt: transactionCreatedAt?.[index]?.createdAt,
        };
      });
    }),
});
