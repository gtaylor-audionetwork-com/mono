"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DEMO_SESSION_COOKIE, DEMO_SESSION_VALUE } from "../../../lib/session";

export function DemoSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/";

  return (
    <p>
      <button
        type="button"
        onClick={() => {
          document.cookie = `${DEMO_SESSION_COOKIE}=${DEMO_SESSION_VALUE}; path=/; SameSite=Lax`;
          router.push(returnTo.startsWith("/") ? returnTo : "/");
        }}
      >
        Continue with demo sign-in
      </button>
    </p>
  );
}
