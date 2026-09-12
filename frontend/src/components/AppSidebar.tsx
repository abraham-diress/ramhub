"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CalendarDays, BookOpen, FileText, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/Logo";

const APP_LINKS = [
  { href: "/app/boards", label: "Boards", icon: LayoutDashboard },
  { href: "/app/calendar", label: "Calendar", icon: CalendarDays },
];

const INFO_LINKS = [
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/paperwork", label: "Paperwork", icon: FileText },
  { href: "/contacts", label: "Contacts", icon: Users },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AppSidebar({ userName, userEmail }: { userName: string; userEmail: string }) {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
      pathname.startsWith(href)
        ? "bg-secondary text-secondary-foreground font-medium"
        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
    }`;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-card px-4 py-6">
      <Link href="/" className="mb-8 px-2 font-heading text-lg font-semibold tracking-tight">
        <Logo />
      </Link>

      <nav className="flex flex-col gap-1">
        {APP_LINKS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={linkClass(href)}>
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <Separator className="my-4" />
      <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Resources</p>
      <nav className="flex flex-col gap-1">
        {INFO_LINKS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={linkClass(href)}>
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <Separator />
        <div className="flex items-center gap-3 px-2">
          <Avatar className="size-8">
            <AvatarFallback>{initials(userName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
