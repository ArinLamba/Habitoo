"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeleteHabitLogs } from "@/hooks/mutations/use-delete-habit-logs";
import { formatDate } from "@/lib/date";
import { Completion } from "@/lib/types";

type Props = {
  habitId: string;
  logs: Completion[];
  unit: string;
};

export const LogHistory = ({ habitId, logs, unit }: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteLogs = useDeleteHabitLogs();

  const groupedLogs = useMemo(
    () =>
      logs.reduce((acc, log) => {
        if (!acc[log.date]) {
          acc[log.date] = [];
        }

        acc[log.date].push(log);

        return acc;
      }, {} as Record<string, Completion[]>),
    [logs]
  );

  const selectedCount = selectedIds.length;

  const toggleLog = (logId: string) => {
    setSelectedIds((current) =>
      current.includes(logId)
        ? current.filter((id) => id !== logId)
        : [...current, logId]
    );
  };

  const confirmDelete = () => {
    if (selectedIds.length === 0) return;

    deleteLogs.mutate(
      { habitId, logIds: selectedIds },
      {
        onSuccess: () => {
          toast.success("Selected logs deleted");
          setSelectedIds([]);
          setConfirmOpen(false);
        },
        onError: () => toast.error("Failed to delete selected logs"),
      }
    );
  };

  if (logs.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No logs yet.
      </div>
    );
  }

  return (
    <div className="relative flex flex-col pb-16">
      {Object.entries(groupedLogs).map(([date, dateLogs]) => (
        <div key={date}>
          <div className="border-b border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:border-white/10">
            {formatDisplayDate(date)}
          </div>

          <div>
            {dateLogs.map((log) => {
              const selected = selectedIds.includes(log.id);

              return (
                <div
                  className={`flex w-full items-center justify-between gap-3 border-b border-black/5 px-3 py-2 text-left text-sm transition-colors last:border-b-0 dark:border-white/5 ${
                    selected
                      ? "bg-blue-500/10"
                      : "bg-white/60 hover:bg-zinc-100 dark:bg-zinc-950/30 dark:hover:bg-zinc-900"
                  }`}
                  key={log.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleLog(log.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleLog(log.id);
                    }
                  }}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Checkbox checked={selected} aria-label="Select log" />
                    <span className="font-medium">
                      +{log.value} {unit}
                    </span>
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {formatLogTime(log.completedAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {selectedCount > 0 ? (
        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-black/10 bg-background/95 px-3 py-3 backdrop-blur dark:border-white/10">
          <span className="text-sm font-semibold text-muted-foreground">
            {selectedCount} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              disabled={deleteLogs.isPending}
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
            >
              Cancel
            </Button>
            <Button
              disabled={deleteLogs.isPending}
              size="sm"
              variant="destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        </div>
      ) : null}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected logs?</AlertDialogTitle>
            <AlertDialogDescription>
              This progress is irreversible. Deleted log entries cannot be restored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteLogs.isPending}
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete {selectedCount}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const displayDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const formatLogTime = (date: string | Date) => {
  return timeFormatter.format(new Date(date));
};

const formatDisplayDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (dateStr === formatDate(today)) return "Today";
  if (dateStr === formatDate(yesterday)) return "Yesterday";

  return displayDateFormatter.format(d);
};
