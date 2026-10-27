import { MarketingShell } from "@web/shell";
import type { ReactNode } from "react";

export default function MarketingRouteLayout({ children }: { children: ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
