"use client";

import { setDemoSessionCookie } from "@web/data";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./LoginPage.module.css";

export function DemoLoginPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/";

  return (
    <div className={styles.panel}>
      <p className={styles.lead}>This demo uses a cookie — no password. Production would use musicapp auth.</p>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={() => {
          setDemoSessionCookie();
          router.push(returnTo.startsWith("/") ? returnTo : "/");
          router.refresh();
        }}
      >
        Log in (demo)
      </button>
    </div>
  );
}
