"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { StickyWrapperClient } from "./layout/sticky-wrapper-client";

import { useDrawerModal } from "@/store/use-drawer-modal";



export const MobileHabitDrawer = () => {
  const { isOpen , close } = useDrawerModal();
  return (
    <div className="lg:hidden">

      {/* Trigger Button */}
      <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>

        <DrawerContent className="h-[85vh] flex flex-col px-3 pt-3">
          {/* 👇 reuse your entire UI */}
          <StickyWrapperClient />

        </DrawerContent>
      </Drawer>

    </div>
  );
};