"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AddToProjectProvider, ModalProvider, PlayerProvider } from "@web/data";
import "@web/ui/styles.css";
import { useState, type ReactNode } from "react";
import { Layout } from "./layout/Layout";
import { ModalHost } from "./modal-host/ModalHost";

export function AppShell({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <ModalProvider>
          <AddToProjectProvider>
            <Layout>{children}</Layout>
            <ModalHost />
          </AddToProjectProvider>
        </ModalProvider>
      </PlayerProvider>
    </QueryClientProvider>
  );
}
