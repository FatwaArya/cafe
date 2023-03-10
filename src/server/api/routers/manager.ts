import { z } from "zod";

import { createTRPCRouter, managerProcedure } from "../trpc";

export const managerRouter = createTRPCRouter({
  getTransaction: managerProcedure.query(async ({ ctx, input }) => {
    const transactions = await ctx.prisma.transactionDetail.findMany({
      include: {
        transaction: {
          select: {
            id: true,
            quantity: true,
            createdAt: true,
            status: true,
            user: {
              select: {
                name: true,
              },
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

  getStatistic: managerProcedure.query(async ({ ctx, input }) => {
    //group transaction to list out the total quantity of each product
    const transactions = await ctx.prisma.transaction.groupBy({
      by: ["menuId", "createdAt"],
      _sum: {
        quantity: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
    });

    //get the menu name
    const menu = await ctx.prisma.menu.findMany({
      select: {
        id: true,
        name: true,
        price: true,
      },
      where: {
        id: {
          in: transactions.map((transaction) => transaction.menuId),
        },
      },
    });

    //merge the menu name to the transaction
    const merged = transactions.map((transaction, index) => {
      const menuMatch = menu.find((m) => m.id === transaction.menuId);
      const menuName = menuMatch ? menuMatch.name : "Unknown Menu Item";
      const menuPrice = menuMatch ? parseInt(menuMatch.price) : 0;
      return {
        ...transaction,
        menuName,
        menuPrice,
      };
    });

    return merged;
  }),
});
