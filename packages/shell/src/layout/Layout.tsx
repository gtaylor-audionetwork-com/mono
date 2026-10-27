"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./Layout.module.css";
import { Player } from "./Player/Player";
import { ProjectSidebar } from "./ProjectSidebar";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/albums", label: "Albums" },
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
