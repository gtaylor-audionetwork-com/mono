"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PlayerProvider } from "@web/data";
import "@web/ui/styles.css";
import { useState, type ReactNode } from "react";

/** Campaign / marketing layouts: shared player state and API, no catalogue chrome or player bar. */
export function MarketingShell({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>{children}</PlayerProvider>
    </QueryClientProvider>
  );
}
