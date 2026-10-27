import "@web/ui/styles.css";
import type { ReactNode } from "react";
import { MarketingLayout } from "./layout/MarketingLayout";

export function MarketingShell({ children }: { children: ReactNode }) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
