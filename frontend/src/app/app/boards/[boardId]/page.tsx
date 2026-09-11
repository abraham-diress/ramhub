"use client";

import { use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { boardsApi } from "@/lib/api-client";
import KanbanBoard from "@/features/boards/KanbanBoard";

export default function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = use(params);
  const id = Number(boardId);
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";

  const { data: board, isLoading } = useQuery({
    queryKey: ["board", id],
    queryFn: () => boardsApi.get(token, id),
    enabled: !!token,
  });

  return (
    <div className="flex h-full flex-col py-6">
      <div className="mb-4 flex items-center gap-3 px-8">
        <Link href="/app/boards" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="font-heading text-xl font-semibold tracking-tight">{board?.title ?? "Loading…"}</h1>
      </div>

      {isLoading && <p className="px-8 text-sm text-muted-foreground">Loading board…</p>}
      {board && <KanbanBoard board={board} token={token} />}
    </div>
  );
}
