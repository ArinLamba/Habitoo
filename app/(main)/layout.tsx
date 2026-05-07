import { MobileHeader } from "@/components/layout/mobile-header";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {

  return (
    <>
      <MobileHeader />
      {/* <Sidebar className="hidden lg:flex"/> */}
      <main className=" h-full pt-[68px]">
        <div className="max-w-[1446px] mx-auto h-full">
          {children}
        </div>
      </main>
    </>
  )
}

export default MainLayout;