const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Formats a "calendar date" (a due date or all-day event) using its UTC date
 * components rather than the viewer's local timezone. These values are stored
 * as UTC midnight and have no real time-of-day meaning, so converting to local
 * time before formatting can shift the displayed day by one for timezones
 * behind UTC (e.g. an Oct 1 UTC due date rendering as "Sep 30" in US Eastern).
 */
export function formatCalendarDate(dateStr: string, options: { year?: boolean } = {}) {
  const d = new Date(dateStr);
  const month = MONTHS[d.getUTCMonth()];
  const day = d.getUTCDate();
  return options.year ? `${month} ${day}, ${d.getUTCFullYear()}` : `${month} ${day}`;
}

/** Extracts the YYYY-MM-DD calendar date from an ISO datetime string, ignoring timezone. */
export function toCalendarDateString(dateStr: string) {
  return dateStr.slice(0, 10);
}
