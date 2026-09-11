"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/paperwork", label: "Paperwork" },
  { href: "/contacts", label: "Contacts" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          🐏 RamHub
        </Link>
        <ul className="flex gap-6 text-sm">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={
                  pathname === link.href
                    ? "font-medium underline underline-offset-4"
                    : "text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
