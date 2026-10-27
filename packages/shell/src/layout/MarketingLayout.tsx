import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./MarketingLayout.module.css";

/** Logged-out / support chrome: header only — no player, sidebar, or modals. */
export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            My monorepo
          </Link>
          <nav aria-label="Support" className={styles.nav}>
            <Link href="/support" className={styles.navLink}>
              Support
            </Link>
            <Link href="/" className={styles.navLink}>
              Open catalogue
            </Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
