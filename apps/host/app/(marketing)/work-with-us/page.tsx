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
        This page is part of the logged-out marketing surface — like acquisition and partner content in
        musicapp. It lives in the marketing route group and is hidden from the nav once
        you sign in.
      </p>
      <ul>
        <li>Licensing built for production teams, agencies, and broadcast.</li>
        <li>Clear rights, stems, and formats when you are ready to download.</li>
        <li>Projects to collect tracks before you commit.</li>
      </ul>
      <p>
        <Link href="/login">Log in</Link> to use projects, or <Link href="/">browse the catalogue</Link>{" "}
        without an account.
      </p>
    </>
  );
}
