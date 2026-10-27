"use client";

import { hasDemoSessionCookieClient } from "@web/data";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useDemoSignedIn(): boolean {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(hasDemoSessionCookieClient());
  }, [pathname]);

  return signedIn;
}
