import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { ROLE } from "@prisma/client";

export const adminRouter = createTRPCRouter({
  getUsers: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        role: {
          not: "ADMIN",
        },
      },
    });
    return users;
  }),
  whitelistUser: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      const user = await ctx.prisma.whitelistEmail.create({
        data: {
          email,
        },
      });
      return user;
    }),
  getWhitelist: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.whitelistEmail.findMany();
  }),
  getUserById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const user = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          role: true,
        },
      });
      return user;
    }),
  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["MANAGER", "CASHIER", "ADMIN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, role } = input;
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          role: true,
        },
      });
      //cant change the same role
      if (user?.role === role) {
        throw new Error("cant change the same role");
      }

      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: role,
        },
      });
    }),
  deleteWhitelist: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      await ctx.prisma.whitelistEmail.delete({
        where: {
          email,
        },
      });
    }),
});
