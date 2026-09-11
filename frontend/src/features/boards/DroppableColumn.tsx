"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { Column, Card as CardType } from "@/lib/api-client";
import SortableCard from "@/features/boards/SortableCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function DroppableColumn({
  column,
  onAddCard,
  onCardClick,
  onDeleteColumn,
}: {
  column: Column;
  onAddCard: (columnId: number, title: string) => void;
  onCardClick: (card: CardType) => void;
  onDeleteColumn: (columnId: number) => void;
}) {
  const { setNodeRef } = useDroppable({ id: `column-${column.id}`, data: { type: "column", columnId: column.id } });
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const submit = () => {
    if (title.trim()) onAddCard(column.id, title.trim());
    setTitle("");
    setAdding(false);
  };

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl bg-muted/50 p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-medium">
          {column.title} <span className="text-muted-foreground">({column.cards.length})</span>
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-6">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onClick={() => onDeleteColumn(column.id)}>
              <Trash2 className="size-4" />
              Delete list
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div ref={setNodeRef} className="flex min-h-4 flex-col gap-2">
        <SortableContext items={column.cards.map((c) => `card-${c.id}`)} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <SortableCard key={card.id} card={card} onClick={() => onCardClick(card)} />
          ))}
        </SortableContext>
      </div>

      {adding ? (
        <div className="mt-2 flex flex-col gap-2">
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") setAdding(false);
            }}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={submit}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="ghost" size="sm" className="mt-2 justify-start text-muted-foreground" onClick={() => setAdding(true)}>
          <Plus className="size-4" />
          Add card
        </Button>
      )}
    </div>
  );
}
