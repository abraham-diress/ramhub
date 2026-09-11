import Link from "next/link";
import MarketingNav from "@/components/MarketingNav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t px-6 py-8 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p>🐏 RamHub — built for Fordham international students.</p>
          <div className="flex gap-6">
            <Link href="/courses" className="hover:text-foreground">
              Courses
            </Link>
            <Link href="/paperwork" className="hover:text-foreground">
              Paperwork
            </Link>
            <Link href="/contacts" className="hover:text-foreground">
              Contacts
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
