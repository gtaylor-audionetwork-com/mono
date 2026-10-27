import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DemoLoginPanel } from "./DemoLoginPanel";

export const loginPageMetadata: Metadata = {
  title: "Log in",
};

export function LoginPage() {
  return (
    <>
      <h1>Log in</h1>
      <p>Sign in to open projects and add tracks from the catalogue player.</p>
      <Suspense fallback={null}>
        <DemoLoginPanel />
      </Suspense>
      <p>
        <Link href="/">Back to catalogue</Link>
        {" · "}
        <Link href="/support">Support</Link>
      </p>
    </>
  );
}
