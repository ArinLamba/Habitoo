"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";

import { useDeleteHabit } from "@/hooks/mutations/use-delete-habit";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

type Props = {
  id: string;
  children: React.ReactNode;
};

export const DeleteButton = ({
  id,
  children,
}: Props) => {
  const router = useRouter();

  const { mutate: deleteMutate } =
    useDeleteHabit();

  const handleDelete = () => {
    deleteMutate(id, {
      onSuccess: () => {
        toast.success("Habit Deleted")
        router.push("/habits");
      },
        
      onError: () => toast.error("Failed to delete habit"),
    });
  };

  return (
    <AlertDialog>

      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">

        <AlertDialogHeader>

          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>

          <AlertDialogTitle>
            Delete Habit?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete
            this Habit. This action
            cannot be undone.
          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel variant="outline">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            variant="destructive"
          >
            Delete
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  );
};