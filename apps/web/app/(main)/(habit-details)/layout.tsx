
import { Sidebar } from "@/components/layout/sidebar";

type Props = {
  children: React.ReactNode;
};

const HabitDetailsLayout = ({ children }: Props) => {

  return (
    <>
      <Sidebar className="top-2 hidden h-[calc(100vh-16px)] xl:flex"/>
      <main className="h-full bg-zinc-100 px-1 pt-2 dark:bg-zinc-950 lg:pr-[275px] xl:px-4 xl:pl-[250px] xl:pr-[275px]">
        <div className="mx-auto h-full max-w-full">
          {children}
        </div>
      </main>
    </>
  )
}

export default HabitDetailsLayout;
