"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { StickyWrapperClient } from "./sticky-wrapper-client";
import { Habit } from "@/lib/types";

import { useDrawerModal } from "@/store/use-drawer-modal";

type Props = {
  habits: Habit[];
};

export const MobileHabitDrawer = ({ habits }: Props) => {
  const { isOpen , close } = useDrawerModal();
  return (
    <div className="lg:hidden">

      {/* Trigger Button */}
      <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>

        <DrawerContent className="h-[85vh] flex flex-col px-3 pt-3">
          {/* 👇 reuse your entire UI */}
          <StickyWrapperClient habits={habits} />

        </DrawerContent>
      </Drawer>

    </div>
  );
};