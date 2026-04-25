import { MobileHeader } from "@/components/mobile-header";


type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <MobileHeader />
      {/* <Sidebar className="hidden lg:flex"/> */}
      <main className=" h-full pt-[48px] mt-5">
        <div className="max-w-[1446px] mx-auto  h-full mb-6">
          {children}
        </div>
      </main>
    </>
  )
}

export default MainLayout;