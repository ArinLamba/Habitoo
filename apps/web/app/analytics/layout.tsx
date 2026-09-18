
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "./header";

type Props = {
  children: React.ReactNode;
};

const AnalyticsLayout = ({ children }: Props) => {

  return (
    <>
      <Header />
      <Sidebar className="hidden h-[calc(100vh-16px)] xl:top-2 xl:flex"/>
      <main className="h-full bg-zinc-100 px-1 pt-[44px] dark:bg-zinc-950 lg:pr-[275px] xl:px-4 xl:pl-[250px] xl:pr-[275px] xl:pt-2">
        <div className="mx-auto h-full max-w-full">
          {children}
        </div>
      </main>
    </>
  )
}

export default AnalyticsLayout;
