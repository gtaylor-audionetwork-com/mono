import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./SupportLayout.module.css";
import { SupportNav } from "./SupportNav";

/** Help / login chrome — no player, no projects sidebar; distinct from the catalogue app. */
export function SupportLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brandBlock}>
            <Link href="/support" className={styles.brand}>
              Support
            </Link>
            <p className={styles.context}>Help, account access, and licensing questions</p>
          </div>
          <SupportNav />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
