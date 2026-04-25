import { Menu } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"
import { DialogTitle } from "@radix-ui/react-dialog"

export const MobileSidebar = () => {
	return (
		<Sheet>
			<SheetTrigger>
				<Menu className="dark:text-white "/>
				<DialogTitle />
			</SheetTrigger>
			<SheetContent className="p-0 z-[100]" side="left">
				<Sidebar />
			</SheetContent>
		</Sheet>
	)
}


