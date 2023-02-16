import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { createTRPCRouter, managerProcedure } from "../trpc";

export const managerRouter = createTRPCRouter({
  getTransaction: managerProcedure.query(async ({ ctx }) => {
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

      orderBy: {
        createdAt: "desc",
      },
    });

    return transactions;
  }),
});
