import { createTRPCRouter } from "./trpc";
import { cashierRouter } from "./routers/cashier";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  cashier: cashierRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
