import { MobileHeader } from "@/components/layout/mobile-header";
import { Sidebar } from "@/components/layout/sidebar";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {

  return (
    <>
      <MobileHeader />
      <Sidebar className="hidden lg:flex"/>
      <main className=" h-full pt-[60px] lg:pl-[250px] lg:pr-[340px] px-4">
        <div className="max-w-[1024px] pl40px]  mx-auto bg-aber-300 h-full">
          {children}
        </div>
      </main>
    </>
  )
}

export default MainLayout;