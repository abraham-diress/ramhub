import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppSidebar from "@/components/AppSidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-svh">
      <AppSidebar userName={session.user?.name ?? "Student"} userEmail={session.user?.email ?? ""} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
