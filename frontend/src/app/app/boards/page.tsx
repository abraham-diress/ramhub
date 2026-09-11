"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, LayoutDashboard } from "lucide-react";
import { boardsApi } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function BoardsPage() {
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const { data: boards, isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: () => boardsApi.list(token),
    enabled: !!token,
  });

  const createBoard = useMutation({
    mutationFn: (title: string) => boardsApi.create(token, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      setOpen(false);
      setTitle("");
      toast.success("Board created");
    },
    onError: () => toast.error("Couldn't create board"),
  });

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Your boards</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track courses, applications, and deadlines your way.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              New board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a board</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="board-title">Title</Label>
              <Input
                id="board-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fall Semester"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && title.trim()) createBoard.mutate(title.trim());
                }}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={!title.trim() || createBoard.isPending}
                onClick={() => createBoard.mutate(title.trim())}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading boards…</p>}

      {boards && boards.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <LayoutDashboard className="mb-3 size-8 text-muted-foreground" />
          <p className="font-medium">No boards yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first board to start tracking tasks.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {boards?.map((board) => (
          <Link key={board.id} href={`/app/boards/${board.id}`}>
            <Card className="transition hover:border-primary/40 hover:shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">{board.title}</CardTitle>
                <CardDescription>Created {new Date(board.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
