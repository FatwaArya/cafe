import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";

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
    const whitelist = await ctx.prisma.whitelistEmail.findMany();
    //only return email that not the same as the user email
    if (ctx.session.user) {
      return whitelist.filter((item) => item.email !== ctx.session.user.email);
    }
  }),
});
