"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import { toast } from "sonner";
import { calendarApi } from "@/lib/api-client";
import { toCalendarDateString } from "@/lib/date";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export default function CalendarPage() {
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";
  const queryClient = useQueryClient();

  const { data: items } = useQuery({
    queryKey: ["calendar"],
    queryFn: () => calendarApi.list(token),
    enabled: !!token,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["calendar"] });

  const createEvent = useMutation({
    mutationFn: () => calendarApi.createEvent(token, { title, description, start_time: `${date}T00:00:00Z`, all_day: true }),
    onSuccess: () => {
      invalidate();
      closeDialog();
      toast.success("Event added");
    },
    onError: () => toast.error("Couldn't add event"),
  });

  const updateEvent = useMutation({
    mutationFn: () =>
      calendarApi.updateEvent(token, editingId!, { title, description, start_time: `${date}T00:00:00Z` }),
    onSuccess: () => {
      invalidate();
      closeDialog();
      toast.success("Event updated");
    },
    onError: () => toast.error("Couldn't update event"),
  });

  const removeEvent = useMutation({
    mutationFn: () => calendarApi.removeEvent(token, editingId!),
    onSuccess: () => {
      invalidate();
      closeDialog();
      toast.success("Event removed");
    },
    onError: () => toast.error("Couldn't remove event"),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDate("");
  };

  const events = useMemo(
    () =>
      items?.map((item) => ({
        id: `${item.type}-${item.id}`,
        title: item.title,
        // All-day items have no real time-of-day — pass the bare calendar date
        // (not a full ISO datetime) so FullCalendar doesn't shift it a day via
        // local-timezone parsing.
        start: item.all_day ? toCalendarDateString(item.start) : item.start,
        end: item.end ? (item.all_day ? toCalendarDateString(item.end) : item.end) : undefined,
        allDay: item.all_day,
        extendedProps: { type: item.type, editable: item.editable, rawId: item.id, description: item.description },
      })) ?? [],
    [items]
  );

  const onDateClick = (arg: DateClickArg) => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDate(arg.dateStr);
    setDialogOpen(true);
  };

  const onEventClick = (arg: EventClickArg) => {
    if (!arg.event.extendedProps.editable) {
      toast.info("This is a task due date — edit it from the board it belongs to.");
      return;
    }
    setEditingId(arg.event.extendedProps.rawId);
    setTitle(arg.event.title);
    setDescription(arg.event.extendedProps.description ?? "");
    setDate(arg.event.startStr.slice(0, 10));
    setDialogOpen(true);
  };

  const renderEventContent = (arg: EventContentArg) => (
    <div className="flex items-center gap-1 truncate px-1">
      {arg.event.extendedProps.type === "task" && (
        <Badge variant="secondary" className="h-4 px-1 text-[10px]">
          Task
        </Badge>
      )}
      <span className="truncate">{arg.event.title}</span>
    </div>
  );

  return (
    <div className="px-8 py-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Click a date to add an event. Task due dates from your boards show up automatically.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}
          dateClick={onDateClick}
          eventClick={onEventClick}
          eventContent={renderEventContent}
          headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit event" : "New event"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="event-title">Title</Label>
              <Input id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="event-date">Date</Label>
              <Input id="event-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="event-desc">Notes</Label>
              <Textarea id="event-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            {editingId && (
              <Button variant="ghost" className="text-destructive" onClick={() => removeEvent.mutate()}>
                <Trash2 className="size-4" />
                Delete
              </Button>
            )}
            <Button
              disabled={!title.trim() || !date}
              onClick={() => (editingId ? updateEvent.mutate() : createEvent.mutate())}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
