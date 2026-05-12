import { Menu } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import { DialogTitle } from "@radix-ui/react-dialog"
import { StickyWrapperClient } from "./sticky-wrapper-client"

export const MobileRightSidebar = () => {
	return (
		<Sheet modal={false}>
			<SheetTrigger>
				<Menu className="dark:text-white block lg:hidden" size={18}/>
				<DialogTitle />
			</SheetTrigger>
			<SheetContent className="p-3 erflow-visible" side="right">
				<StickyWrapperClient />
			</SheetContent>
		</Sheet>
	)
}


