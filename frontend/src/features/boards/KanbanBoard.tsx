"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BoardDetail, Card as CardType, Column, boardsApi } from "@/lib/api-client";
import DroppableColumn from "@/features/boards/DroppableColumn";
import SortableCard from "@/features/boards/SortableCard";
import CardDetailDialog from "@/features/boards/CardDetailDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function reindex(cards: CardType[]) {
  return cards.map((c, i) => ({ ...c, position: i }));
}

export default function KanbanBoard({ board, token }: { board: BoardDetail; token: string }) {
  const [columns, setColumns] = useState<Column[]>(board.columns);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => setColumns(board.columns), [board]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["board", board.id] });

  const createColumn = useMutation({
    mutationFn: (title: string) => boardsApi.createColumn(token, board.id, title),
    onSuccess: (col) => {
      setColumns((cols) => [...cols, { ...col, cards: [] }]);
      setAddingColumn(false);
      setNewColumnTitle("");
    },
    onError: () => toast.error("Couldn't create list"),
  });

  const deleteColumn = useMutation({
    mutationFn: (columnId: number) => boardsApi.removeColumn(token, columnId),
    onSuccess: (_data, columnId) => setColumns((cols) => cols.filter((c) => c.id !== columnId)),
    onError: () => toast.error("Couldn't delete list"),
  });

  const createCard = useMutation({
    mutationFn: ({ columnId, title }: { columnId: number; title: string }) =>
      boardsApi.createCard(token, columnId, { title }),
    onSuccess: (card, { columnId }) => {
      setColumns((cols) => cols.map((c) => (c.id === columnId ? { ...c, cards: [...c.cards, card] } : c)));
    },
    onError: () => toast.error("Couldn't add card"),
  });

  const updateCard = useMutation({
    mutationFn: ({ cardId, payload }: { cardId: number; payload: Partial<CardType> }) =>
      boardsApi.updateCard(token, cardId, payload),
    onError: () => {
      toast.error("Couldn't save changes");
      invalidate();
    },
  });

  const deleteCard = useMutation({
    mutationFn: (cardId: number) => boardsApi.removeCard(token, cardId),
    onSuccess: (_data, cardId) => {
      setColumns((cols) => cols.map((c) => ({ ...c, cards: c.cards.filter((card) => card.id !== cardId) })));
      setEditingCard(null);
    },
    onError: () => toast.error("Couldn't delete card"),
  });

  const findColumnOfCard = (cardId: number) => columns.find((c) => c.cards.some((card) => card.id === cardId));

  const onDragStart = (event: DragStartEvent) => {
    const cardId = Number(String(event.active.id).replace("card-", ""));
    const col = findColumnOfCard(cardId);
    setActiveCard(col?.cards.find((c) => c.id === cardId) ?? null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const activeCardId = Number(String(active.id).replace("card-", ""));
    const sourceColumn = findColumnOfCard(activeCardId);
    if (!sourceColumn) return;

    const overId = String(over.id);
    const destColumnId = overId.startsWith("column-")
      ? Number(overId.replace("column-", ""))
      : findColumnOfCard(Number(overId.replace("card-", "")))?.id;
    if (destColumnId === undefined) return;

    const destColumn = columns.find((c) => c.id === destColumnId);
    if (!destColumn) return;

    const activeIndex = sourceColumn.cards.findIndex((c) => c.id === activeCardId);
    const overCardId = overId.startsWith("card-") ? Number(overId.replace("card-", "")) : null;
    const overIndex = overCardId ? destColumn.cards.findIndex((c) => c.id === overCardId) : destColumn.cards.length;

    if (sourceColumn.id === destColumn.id && activeIndex === overIndex) return;

    setColumns((cols) => {
      const next = cols.map((c) => ({ ...c, cards: [...c.cards] }));
      const src = next.find((c) => c.id === sourceColumn.id)!;
      const dst = next.find((c) => c.id === destColumn.id)!;
      const [moved] = src.cards.splice(activeIndex, 1);

      if (src.id === dst.id) {
        dst.cards = reindex(arrayMove(src.cards, activeIndex, overIndex >= 0 ? overIndex : dst.cards.length));
      } else {
        const insertAt = overIndex >= 0 ? overIndex : dst.cards.length;
        dst.cards.splice(insertAt, 0, { ...moved, column_id: dst.id });
        src.cards = reindex(src.cards);
        dst.cards = reindex(dst.cards);
      }
      return next;
    });

    updateCard.mutate({ cardId: activeCardId, payload: { column_id: destColumn.id, position: Math.max(overIndex, 0) } });
  };

  return (
    <div className="flex h-full flex-col">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex flex-1 gap-4 overflow-x-auto px-8 pb-8">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              column={column}
              onAddCard={(columnId, title) => createCard.mutate({ columnId, title })}
              onCardClick={setEditingCard}
              onDeleteColumn={(columnId) => deleteColumn.mutate(columnId)}
            />
          ))}

          <div className="w-72 shrink-0">
            {addingColumn ? (
              <div className="flex flex-col gap-2 rounded-xl bg-muted/50 p-3">
                <Input
                  autoFocus
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="List name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newColumnTitle.trim()) createColumn.mutate(newColumnTitle.trim());
                    if (e.key === "Escape") setAddingColumn(false);
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => newColumnTitle.trim() && createColumn.mutate(newColumnTitle.trim())}>
                    Add list
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setAddingColumn(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={() => setAddingColumn(true)}>
                <Plus className="size-4" />
                Add another list
              </Button>
            )}
          </div>
        </div>

        <DragOverlay>{activeCard && <SortableCard card={activeCard} onClick={() => {}} />}</DragOverlay>
      </DndContext>

      <CardDetailDialog
        card={editingCard}
        onClose={() => setEditingCard(null)}
        onSave={(cardId, payload) => {
          setColumns((cols) =>
            cols.map((c) => ({ ...c, cards: c.cards.map((card) => (card.id === cardId ? { ...card, ...payload } : card)) }))
          );
          updateCard.mutate({ cardId, payload });
        }}
        onDelete={(cardId) => deleteCard.mutate(cardId)}
      />
    </div>
  );
}
