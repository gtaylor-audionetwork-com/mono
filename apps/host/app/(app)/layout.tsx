import { AppShell } from "@web/shell";
import type { ReactNode } from "react";

export default function CatalogueAppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
