
type Props = {
  children: React.ReactNode;
};

const StatsLayout = ({ children }: Props) => {
  return (
    <>
      {/* <Sidebar className="hidden lg:flex"/> */}
      <main className=" h-full">
        <div className="max-w-[1056px]  mx-auto h-full mb-6">
          {children}
        </div>
      </main>
    </>
  )
}

export default StatsLayout;