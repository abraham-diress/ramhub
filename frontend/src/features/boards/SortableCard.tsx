"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarClock } from "lucide-react";
import { Card as CardType } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { formatCalendarDate } from "@/lib/date";

export default function SortableCard({ card, onClick }: { card: CardType; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `card-${card.id}`,
    data: { type: "card", card },
  });

  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`cursor-grab gap-2 py-3 shadow-sm active:cursor-grabbing ${isDragging ? "opacity-40" : ""}`}
    >
      <CardContent className="px-3">
        <p className="text-sm font-medium leading-snug">{card.title}</p>
        {card.due_date && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarClock className="size-3" />
            {formatCalendarDate(card.due_date)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
