import { Menu } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import { DialogTitle } from "@radix-ui/react-dialog"


type Props = {
	children: React.ReactNode;
}
export const MobileRightSidebar = ( { children }: Props) => {
	return (
		<Sheet>
			<SheetTrigger>
				<Menu className="dark:text-white block lg:hidden px-2 w-auto" size={16}/>
				<DialogTitle />
			</SheetTrigger>
			<SheetContent className="p-3 overlow-visible" side="right">
				{children}
			</SheetContent>
		</Sheet>
	)
}


