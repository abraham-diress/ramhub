import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/paperwork", label: "Paperwork" },
  { href: "/contacts", label: "Contacts" },
];

export default async function MarketingNav() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
          🐏 RamHub
        </Link>
        <ul className="hidden gap-8 text-sm text-muted-foreground sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          {session ? (
            <Button asChild size="sm">
              <Link href="/app/boards">Go to app</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign up free</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
