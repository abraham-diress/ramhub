"use client";

import { motion } from "motion/react";
import { CalendarClock } from "lucide-react";

const COLUMNS = [
  {
    title: "To Do",
    cards: [
      { title: "Submit CPT application", due: "Oct 1" },
      { title: "Register for DSCI 6612", due: "Nov 12" },
    ],
  },
  {
    title: "In Progress",
    cards: [{ title: "Health insurance waiver", due: "Sep 15" }],
  },
  {
    title: "Done",
    cards: [{ title: "Immunization records", due: null }],
  },
];

export default function BoardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-3xl"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/20 via-fuchsia-400/10 to-transparent blur-3xl" />
      <div className="rounded-2xl border bg-card/80 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
        <div className="mb-4 flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-muted-foreground">Fall Semester board</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {COLUMNS.map((col, colIndex) => (
            <div key={col.title} className="rounded-xl bg-muted/60 p-2.5">
              <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">{col.title}</p>
              <div className="flex flex-col gap-2">
                {col.cards.map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + colIndex * 0.15 + i * 0.1 }}
                    className="rounded-lg border bg-card p-2.5 shadow-sm"
                  >
                    <p className="text-[11px] font-medium leading-snug sm:text-xs">{card.title}</p>
                    {card.due && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <CalendarClock className="size-2.5" />
                        {card.due}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
