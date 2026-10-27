"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useDemoSignedIn } from "./useDemoSignedIn";

type LoggedOutNavLinkProps = {
  href: string;
  children: ReactNode;
  linkClassName?: string;
};

/** Marketing links that disappear once the demo session cookie is set. */
export function LoggedOutNavLink({ href, children, linkClassName }: LoggedOutNavLinkProps) {
  const pathname = usePathname();
  const signedIn = useDemoSignedIn();

  if (signedIn) return null;

  return (
    <Link href={href} className={linkClassName} aria-current={pathname === href ? "page" : undefined}>
      {children}
    </Link>
  );
}
