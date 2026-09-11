"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Card as CardType } from "@/lib/api-client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function toDateInputValue(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export default function CardDetailDialog({
  card,
  onClose,
  onSave,
  onDelete,
}: {
  card: CardType | null;
  onClose: () => void;
  onSave: (cardId: number, payload: { title: string; description: string | null; due_date: string | null }) => void;
  onDelete: (cardId: number) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description ?? "");
      setDueDate(toDateInputValue(card.due_date));
    }
  }, [card]);

  if (!card) return null;

  const save = () => {
    onSave(card.id, {
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate ? new Date(`${dueDate}T00:00:00Z`).toISOString() : null,
    });
    onClose();
  };

  return (
    <Dialog open={!!card} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit card</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="card-title">Title</Label>
            <Input id="card-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="card-desc">Description</Label>
            <Textarea id="card-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="card-due">Due date</Label>
            <Input id="card-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" className="text-destructive" onClick={() => onDelete(card.id)}>
            <Trash2 className="size-4" />
            Delete
          </Button>
          <Button disabled={!title.trim()} onClick={save}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
