"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";

import { useDateStore } from "@/store/use-date-store";
import { formatDate } from "@/lib/helper";
import { getNoteByDate } from "@/db/queries";
import { upsertNote } from "@/actions/add-note";

export const DailyNote = () => {
  const { currentDate } = useDateStore();
  const dateStr = formatDate(currentDate);

  const [note, setNote] = useState("");
  const [highlight, setHighlight] = useState("");

  const [savedNote, setSavedNote] = useState("");
  const [savedHighlight, setSavedHighlight] = useState("");

  const [loading, setLoading] = useState(false);

  const isDirty =
    note !== savedNote || highlight !== savedHighlight;

  // 🔥 Load note when date changes
  useEffect(() => {
    const load = async () => {
      const res = await getNoteByDate(dateStr);

      const n = res?.note || "";
      const h = res?.highlight || "";

      setNote(n);
      setHighlight(h);

      setSavedNote(n);
      setSavedHighlight(h);
    };

    load();
  }, [dateStr]);

  // 🔥 Save manually
  const handleSave = async () => {
    setLoading(true);

    try {
      await upsertNote(dateStr, note, highlight);

      setSavedNote(note);
      setSavedHighlight(highlight);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
        className="min-h-[120px] w-full rounded-md bg-background border text-sm shadow-sm"
      />

      <Button
        onClick={handleSave}
        disabled={loading || !isDirty}
      >
        {loading ? "Saving..." : "Save"}
      </Button>

      {isDirty && (
        <p className="text-xs text-yellow-500">
          Unsaved changes
        </p>
      )}

      <div className="border-b dark:border-white/20 border-black/20" />
    </div>
  );
};