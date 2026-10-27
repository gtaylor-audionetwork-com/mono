import type { Metadata } from "next";
import Link from "next/link";

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
      <p>
        <Link href="/">Return to the catalogue app</Link>
      </p>
    </>
  );
}
