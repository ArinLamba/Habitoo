"use client";

import { useEffect, useState } from "react";

import { Textarea } from "@/components/ui/textarea";

import { useDateStore } from "@/store/use-date-store";
import { formatDate } from "@/lib/helper";

import { getNoteByDate } from "@/db/queries";
import { upsertNote } from "@/actions/add-note";


export const DailyNote = () => {
  const [note, setNote] = useState("");
  const [highlight, setHighlight] = useState("");
  const [loading, setLoading] = useState(false);

  
  const { currentDate } = useDateStore();
  const dateStr = formatDate(currentDate);

  // 🔥 Load note when date changes
  useEffect(() => {
    const fetchNote = async () => {
      const res = await getNoteByDate(dateStr);
      setNote(res?.note || "");
      setHighlight(res?.highlight || "");
    };

    fetchNote();
  }, [dateStr]);

  // 🔥 Auto-save (debounced)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      await upsertNote(dateStr, note, highlight);
      setLoading(false);
    }, 500); // debounce

    return () => clearTimeout(timeout);
  }, [note, dateStr, highlight]);

  return (
    <div className="  space-y-4">
      <p className="text-sm text-muted-foreground mt-4 mb-1">
        ✨ Highlight
      </p>

      <Textarea
        value={highlight}
        onChange={(e) => setHighlight(e.target.value)}
        placeholder="Best moment of your day..."
        className="w-full p-2 rounded-md bg-background border text-sm shadow-sm"
      />
      <p className="text-sm text-muted-foreground mb-2">
        📝 Reflection ({dateStr})
      </p>

      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Reflect on Your Day ..."
        className="min-h-[120px] w-full rounded-md bg-background border text-sm shadow-sm  "
      />

      <p className="text-xs text-muted-foreground mt-2">
        {loading ? "Saving..." : "Auto-saved"}
      </p>
      <div className="border-b dark:border-white/20 border-black/20" />
    </div>
  );
};