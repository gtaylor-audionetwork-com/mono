import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why work with us",
};

export default function WorkWithUsPage() {
  return (
    <>
      <h1>Why work with us</h1>
      <p>
        Partner and acquisition content lives in the catalogue app so visitors can preview tracks while they
        read — the player stays available. Sign in when you are ready to save work to projects.
      </p>
      <ul>
        <li>Licensing built for production teams, agencies, and broadcast.</li>
        <li>Clear rights, stems, and formats when you download.</li>
        <li>Projects to collect tracks before you commit.</li>
      </ul>
      <p>
        <Link href="/login">Log in</Link> for projects, or <Link href="/">browse featured tracks</Link> below.
      </p>
    </>
  );
}
