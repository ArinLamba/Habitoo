
import { Sidebar } from "@/components/layout/sidebar";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {

  return (
    <>
      <Sidebar className="hidden xl:flex h-full top-2"/>
      <main className=" h-full xl:pl-[250px] lg:pr-[275px] xl:pr-[275px] xl:px-4 px-1 pt-2">
        <div className="max-w-full   mx-auto b300 h-full">
          {children}
        </div>
      </main>
    </>
  )
}

export default MainLayout;