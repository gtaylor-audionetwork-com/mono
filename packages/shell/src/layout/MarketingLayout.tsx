import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./MarketingLayout.module.css";
import { MarketingNav } from "./MarketingNav";

/** Logged-out / support chrome: header only — no player, sidebar, or modals. */
export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            My monorepo
          </Link>
          <MarketingNav />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
