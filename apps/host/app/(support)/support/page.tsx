import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support",
};

export default function SupportPage() {
  return (
    <>
      <h1>How can we help?</h1>
      <p>
        Search licensing FAQs, contact the team, or sign in to manage projects. This area is separate from
        the catalogue app — no player or project sidebar here.
      </p>
      <section>
        <h2>Common tasks</h2>
        <ul>
          <li>
            <Link href="/login">Sign in</Link> to open saved projects
          </li>
          <li>
            <Link href="/">Browse music</Link> without an account
          </li>
          <li>
            Email <a href="mailto:support@example.com">support@example.com</a> (placeholder)
          </li>
        </ul>
      </section>
    </>
  );
}
