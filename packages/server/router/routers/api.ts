import { router, publicProcedure } from "../trpc";
import { observable } from "@trpc/server/observable";

export const apiRouter = router({
  getData: publicProcedure.query(() => {
    return { message: "API is working!" };
  }),

  ping: publicProcedure.subscription(() => {
    return observable<{ time: string }>((emit) => {
      const interval = setInterval(() => {
        emit.next({ time: new Date().toISOString() });
      }, 1000);

      return () => clearInterval(interval);
    });
  }),
});
