"use client";

import { useProjectStore } from "@web/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ProjectSidebar.module.css";

export function ProjectSidebar() {
  const pathname = usePathname();
  const projects = useProjectStore((state) => state.projects);

  return (
    <nav className={styles.sidebar} aria-label="Projects">
      <h2 className={styles.heading}>Projects</h2>
      <ul className={styles.list}>
        {projects.map((project) => {
          const href = `/projects/${project.id}`;
          const trackCount = project.tracks.length;
          return (
            <li key={project.id}>
              <Link
                href={href}
                className={styles.link}
                aria-current={pathname === href ? "page" : undefined}
              >
                <span>{project.name}</span>
                <span className={styles.count}>
                  {trackCount} {trackCount === 1 ? "track" : "tracks"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
