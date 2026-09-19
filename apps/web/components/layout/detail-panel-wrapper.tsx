type Props = {
  children: React.ReactNode;
};

export const DetailPanelWrapper = ({
  children,
}: Props) => {
  return (
    <aside className="fixed right-2 top-[40px] hidden h-[calc(100vh-40px)] w-[268px] flex-col overflow-y-auto rounded-md border border-black/10 bg-white/95 p-2 shadow-sm backdrop-blur scrollbar scrollbar-w-1.5 scrollbar-thumb-zinc-300 dark:border-white/10 dark:bg-zinc-950/95 dark:scrollbar-thumb-zinc-700 lg:flex xl:top-0 xl:h-screen"
    >
      {children}
    </aside>
  );
};
