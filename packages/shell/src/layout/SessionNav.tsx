"use client";

import { clearDemoSessionCookie, hasDemoSessionCookieClient } from "@web/data";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SessionNavProps = {
  linkClassName?: string;
  buttonClassName?: string;
};

export function SessionNav({ linkClassName, buttonClassName }: SessionNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(hasDemoSessionCookieClient());
  }, [pathname]);

  if (signedIn) {
    return (
      <button
        type="button"
        className={buttonClassName ?? linkClassName}
        onClick={() => {
          clearDemoSessionCookie();
          setSignedIn(false);
          router.push("/");
          router.refresh();
        }}
      >
        Log out
      </button>
    );
  }

  const loginHref = `/login?returnTo=${encodeURIComponent(pathname)}`;
  return (
    <Link href={loginHref} className={linkClassName}>
      Log in
    </Link>
  );
}
