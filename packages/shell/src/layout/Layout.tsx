"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./Layout.module.css";
import { Player } from "./Player/Player";
import { ProjectSidebar } from "./ProjectSidebar";
import { LoggedOutNavLink } from "./LoggedOutNavLink";
import { SessionNav } from "./SessionNav";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/albums", label: "Albums" },
  { href: "/support", label: "Support" },
];

export function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            My monorepo
          </Link>
          <nav aria-label="Main" className={styles.nav}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLink}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <LoggedOutNavLink href="/work-with-us" linkClassName={styles.navLink}>
              Why work with us
            </LoggedOutNavLink>
            <SessionNav linkClassName={styles.navLink} buttonClassName={styles.navButton} />
          </nav>
        </div>
      </header>
      <div className={styles.body}>
        <ProjectSidebar />
        <main className={styles.main}>{children}</main>
      </div>
      <Player />
    </>
  );
}
