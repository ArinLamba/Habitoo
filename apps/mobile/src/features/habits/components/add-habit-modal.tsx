import type { Habit } from "@habitoo/core";
import { memo } from "react";

import { HabitFormModal } from "./habit-form-modal";

type AddHabitModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: string;
  habit?: Habit | null;
};

/** @deprecated Use HabitFormModal directly */
export const AddHabitModal = memo(function AddHabitModal(props: AddHabitModalProps) {
  return <HabitFormModal {...props} />;
});

export { HabitFormModal };
