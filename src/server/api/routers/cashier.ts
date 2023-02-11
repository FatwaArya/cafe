import { z } from "zod";

import { createTRPCRouter, publicProcedure, cashierProcedure } from "../trpc";

export const cashierRouter = createTRPCRouter({
  createOrder: cashierProcedure
    .input(
      z.object({
        customerName: z.string(),
        tableId: z.string(),
        items: z.array(
          z.object({
            menuId: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { customerName, tableId, items } = input;
      //loop through items and create transaction
      items.forEach(async (item) => {
        await ctx.prisma.transaction.create({
          data: {
            customerName,
            tableId,
            menuId: item.menuId,
            userId: ctx.session.user.id,
          },
        });
      });
    }),
});
