"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { boardsApi } from "@/lib/api-client";

export default function TrackButton({ paperworkId }: { paperworkId: number }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tracked, setTracked] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (status !== "authenticated" || !session?.accessToken) {
      router.push("/login");
      return;
    }

    setPending(true);
    try {
      const result = await boardsApi.trackPaperwork(session.accessToken, paperworkId);
      setTracked(true);
      toast.success(
        result.already_tracked
          ? `Already on ${result.board_title}`
          : `Added to ${result.board_title}`
      );
    } catch {
      toast.error("Could not add this to your board");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={pending || tracked}
      className="h-7 gap-1.5 px-2.5 text-xs"
    >
      {tracked ? <Check className="size-3" /> : <Plus className="size-3" />}
      {tracked ? "On your board" : "Track this"}
    </Button>
  );
}
