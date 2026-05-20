"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNote } from "@/hooks/queries/use-note";
import { formatDate } from "@/lib/date";
import { upsertNote } from "@/server/actions/add-note";
import { useDateStore } from "@/store/use-date-store";

export const DailyNote = () => {
  const { currentDate } = useDateStore();
  const dateStr = formatDate(currentDate);
  const { data: saved } = useNote(dateStr);

  return (
    <DailyNoteEditor
      key={`${dateStr}-${saved?.id ?? "empty"}`}
      dateStr={dateStr}
      initialNote={saved?.note || ""}
      initialHighlight={saved?.highlight || ""}
      saved={saved}
    />
  );
};

type DailyNoteEditorProps = {
  dateStr: string;
  initialNote: string;
  initialHighlight: string;
  saved: unknown;
};

const DailyNoteEditor = ({
  dateStr,
  initialNote,
  initialHighlight,
  saved,
}: DailyNoteEditorProps) => {
  const queryClient = useQueryClient();
  const note = initialNote;
  const [highlight, setHighlight] = useState(initialHighlight);
  const [savedNote, setSavedNote] = useState(initialNote);
  const [savedHighlight, setSavedHighlight] = useState(initialHighlight);
  const [loading, setLoading] = useState(false);

  const isDirty =
    note !== savedNote || highlight !== savedHighlight;

  const handleSave = async () => {
    setLoading(true);

    try {
      await upsertNote(dateStr, note, highlight);

      setSavedNote(note);
      setSavedHighlight(highlight);
      queryClient.setQueryData(["note", dateStr], {
        ...(typeof saved === "object" && saved ? saved : {}),
        date: dateStr,
        note,
        highlight,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="mt-4 mb-1 text-sm text-muted-foreground">
        Highlight
      </p>

      <Textarea
        value={highlight}
        onChange={(e) => setHighlight(e.target.value)}
        placeholder="Best moment of your day..."
        className="w-full rounded-md border bg-background p-2 text-sm shadow-sm"
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

      <div className="border-b border-black/20 dark:border-white/20" />
    </div>
  );
};
