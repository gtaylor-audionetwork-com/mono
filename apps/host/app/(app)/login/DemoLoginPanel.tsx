"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DEMO_SESSION_COOKIE, DEMO_SESSION_VALUE } from "../../../lib/session";
import styles from "./login.module.css";

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
          document.cookie = `${DEMO_SESSION_COOKIE}=${DEMO_SESSION_VALUE}; path=/; SameSite=Lax`;
          router.push(returnTo.startsWith("/") ? returnTo : "/");
          router.refresh();
        }}
      >
        Log in (demo)
      </button>
    </div>
  );
}
