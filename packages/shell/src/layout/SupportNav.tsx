"use client";

import Link from "next/link";
import styles from "./SupportLayout.module.css";
import { SessionNav } from "./SessionNav";

export function SupportNav() {
  return (
    <nav aria-label="Support" className={styles.nav}>
      <Link href="/" className={styles.navLink}>
        Catalogue
      </Link>
      <SessionNav linkClassName={styles.navLink} buttonClassName={styles.navButton} />
    </nav>
  );
}
