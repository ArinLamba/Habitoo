
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "./header";

type Props = {
  children: React.ReactNode;
};

const AnalyticsLayout = ({ children }: Props) => {

  return (
    <>
      <Header />
      <Sidebar className="hidden xl:flex h-full"/>
      <main className=" h-full xl:pl-[250px] lg:pr-[275px] xl:pr-[275px] xl:px-4 px-1 xl:pt-2 pt-[44px]">
        <div className="max-w-full   mx-auto  h-full">
          {children}
        </div>
      </main>
    </>
  )
}

export default AnalyticsLayout;