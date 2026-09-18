"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitCorrection } from "@/lib/api";

const CATEGORIES = [
  { value: "course", label: "A course tip" },
  { value: "paperwork", label: "A paperwork correction" },
  { value: "contact", label: "A contact or office" },
  { value: "other", label: "Something else" },
];

export default function ContributeForm({ defaultCategory = "course" }: { defaultCategory?: string }) {
  const [category, setCategory] = useState(defaultCategory);
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (content.trim().length < 10) {
      toast.error("Add a bit more detail so it can be checked");
      return;
    }

    setPending(true);
    try {
      await submitCorrection({
        category,
        content: content.trim(),
        submitter_email: email.trim() || undefined,
      });
      setDone(true);
      setContent("");
      setEmail("");
      toast.success("Thanks, it's queued for review");
    } catch {
      toast.error("Could not send that, try again in a moment");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Got it.</p>
        <p className="mt-1.5">
          Submissions are reviewed before they go live, so it will not appear straight away.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setDone(false)}>
          Add another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="contribute-category">What are you adding?</Label>
          <select
            id="contribute-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contribute-content">Details</Label>
          <Textarea
            id="contribute-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="e.g. which course you took, the workload, what you wish you had known before registering"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contribute-email">Email (optional)</Label>
          <Input
            id="contribute-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Only if you are happy to be asked a follow-up"
          />
        </div>

        <Button type="submit" disabled={pending} className="justify-self-start">
          {pending ? "Sending..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
