"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoggedOutNavLink } from "./LoggedOutNavLink";
import styles from "./MarketingLayout.module.css";
import { SessionNav } from "./SessionNav";

export function MarketingNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Marketing" className={styles.nav}>
      <LoggedOutNavLink href="/work-with-us" linkClassName={styles.navLink}>
        Why work with us
      </LoggedOutNavLink>
      <Link href="/support" className={styles.navLink} aria-current={pathname === "/support" ? "page" : undefined}>
        Support
      </Link>
      <Link href="/" className={styles.navLink}>
        Open catalogue
      </Link>
      <SessionNav linkClassName={styles.navLink} buttonClassName={styles.navButton} />
    </nav>
  );
}
