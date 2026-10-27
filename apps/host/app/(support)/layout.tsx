import { SupportShell } from "@web/shell";
import type { ReactNode } from "react";

export default function SupportRouteLayout({ children }: { children: ReactNode }) {
  return <SupportShell>{children}</SupportShell>;
}
