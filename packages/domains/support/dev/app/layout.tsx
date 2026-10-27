import { SupportShell } from "@web/shell";
import type { ReactNode } from "react";

export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupportShell>{children}</SupportShell>
      </body>
    </html>
  );
}
