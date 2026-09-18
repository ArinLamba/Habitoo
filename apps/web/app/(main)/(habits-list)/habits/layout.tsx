import { MobileHeader } from "@/components/layout/mobile-header";
import { Sidebar } from "@/components/layout/sidebar";

type Props = {
  children: React.ReactNode;
};

const HabitListLayout = ({ children }: Props) => {

  return (
    <>
      <MobileHeader />
      <Sidebar className="top-[40px] hidden h-[calc(100vh-40px)] lg:flex"/>
      <main className="h-full bg-zinc-100 px-1 pt-[40px] dark:bg-zinc-950 lg:px-4 lg:pl-[250px] lg:pr-[275px]">
        <div className="mx-auto h-full max-w-full">
          {children}
        </div>
      </main>
    </>
  )
}

export default HabitListLayout;
