import { z } from "zod";

import { createTRPCRouter, publicProcedure, cashierProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: cashierProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
