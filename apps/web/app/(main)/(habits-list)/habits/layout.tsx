import { MobileHeader } from "@/components/layout/mobile-header";
import { Sidebar } from "@/components/layout/sidebar";

type Props = {
  children: React.ReactNode;
};

const HabitListLayout = ({ children }: Props) => {

  return (
    <>
      <MobileHeader />
      <Sidebar className="hidden lg:flex h-[calc(100vh-40px)] top-[40px]"/>
      <main className=" h-full pt-[40px] lg:pl-[250px] lg:pr-[275px] lg:px-4 px-1">
        <div className="max-w-full   mx-auto b300 h-full">
          {children}
        </div>
      </main>
    </>
  )
}

export default HabitListLayout;