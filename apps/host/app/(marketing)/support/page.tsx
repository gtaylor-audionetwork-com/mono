import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DemoSignIn } from "./DemoSignIn";

export const metadata: Metadata = {
  title: "Support",
};

export default function SupportPage() {
  return (
    <>
      <h1>Support</h1>
      <p>
        Logged-out and help content lives under the marketing route group — minimal chrome, no player or
        project sidebar.
      </p>
      <p>Project pages require a session; this demo uses a cookie set from here or from Cypress.</p>
      <Suspense fallback={null}>
        <DemoSignIn />
      </Suspense>
      <p>
        <Link href="/">Return to the catalogue app</Link>
      </p>
    </>
  );
}
