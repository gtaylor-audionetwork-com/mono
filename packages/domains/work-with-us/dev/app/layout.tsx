import { AppShell } from "@web/shell";
import type { ReactNode } from "react";

export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
