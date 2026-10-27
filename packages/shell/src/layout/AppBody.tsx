"use client";

import type { ReactNode } from "react";
import styles from "./Layout.module.css";
import { ProjectSidebar } from "./ProjectSidebar";
import { useDemoSignedIn } from "./useDemoSignedIn";

export function AppBody({ children }: { children: ReactNode }) {
  const signedIn = useDemoSignedIn();

  return (
    <div className={signedIn ? styles.body : styles.bodyNoSidebar}>
      {signedIn ? <ProjectSidebar /> : null}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
