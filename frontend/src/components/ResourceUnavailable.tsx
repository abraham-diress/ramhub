import { CloudOff } from "lucide-react";

export default function ResourceUnavailable({ resource }: { resource: string }) {
  return (
    <div className="rounded-xl border bg-card p-8 text-center">
      <CloudOff className="mx-auto size-5 text-muted-foreground" />
      <p className="mt-3 font-medium">Could not load {resource} right now</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
        The API is hosted on a free instance that goes to sleep when it is idle, so the first
        request after a quiet spell can time out. Refreshing in a few seconds usually works.
      </p>
    </div>
  );
}
