"use client";

import { clearDemoSessionCookie } from "@web/data";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDemoSignedIn } from "./useDemoSignedIn";

type SessionNavProps = {
  linkClassName?: string;
  buttonClassName?: string;
};

export function SessionNav({ linkClassName, buttonClassName }: SessionNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const signedIn = useDemoSignedIn();

  if (signedIn) {
    return (
      <button
        type="button"
        className={buttonClassName ?? linkClassName}
        onClick={() => {
          clearDemoSessionCookie();
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
