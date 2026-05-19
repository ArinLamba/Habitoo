type Props = {
  children: React.ReactNode;
};

export const DetailPanelWrapper = ({
  children,
}: Props) => {
  return (
    <div className="hidden lg:flex fixed  right-2 top-[59px] h-[calc(100vh-65px)] w-[260px] flex-col gap-y-4 border dark:border-white/10 border-black/10 bg-white dark:bg-zinc-900 shadow-md rounded-md overflow-y-auto"
    >
      {children}
    </div>
  );
};