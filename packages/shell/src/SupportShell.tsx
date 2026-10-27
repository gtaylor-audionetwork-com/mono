import "@web/ui/styles.css";
import type { ReactNode } from "react";
import { SupportLayout } from "./layout/SupportLayout";

export function SupportShell({ children }: { children: ReactNode }) {
  return <SupportLayout>{children}</SupportLayout>;
}
