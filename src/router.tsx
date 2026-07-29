import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Cross-page crossfade via the View Transitions API where supported;
    // a no-op everywhere else, and neutralised by prefers-reduced-motion.
    defaultViewTransition: true,
  });


  return router;
};
