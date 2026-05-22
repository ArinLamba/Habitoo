type Props = {
  children: React.ReactNode;
};

export const DetailPanelWrapper = ({
  children,
}: Props) => {
  return (
    <aside className="hidden lg:flex fixed right-2 xl:top-0 top-[40px] h-full w-[268px] flex-col overflow-y-auto rounded-md border border-black/10 bg-white/95 p-2 shadow-sm backdrop-blur scrollbar scrollbar-w-1.5 scrollbar-thumb-zinc-300 dark:border-white/10 dark:bg-zinc-950/95 dark:scrollbar-thumb-zinc-700"
    >
      {children}
    </aside>
  );
};
