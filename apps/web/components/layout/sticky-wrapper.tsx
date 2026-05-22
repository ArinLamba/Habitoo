type Props = {
  children: React.ReactNode;
};

export const StickyWrapper = ({
  children,
}: Props) => {
  return (
    <div className="hidden lg:flex fixed  right-2 top-[40px] h-full w-[260px] flex-col gap-y-4 border dark:border-white/10 border-black/10 bg-white dark:bg-zinc-950/95 p-2 shadow-md rounded-md overflow-y-auto"
    >
      {children}
    </div>
  );
};