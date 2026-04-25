type Props = {
  children: React.ReactNode;
};

export const StickyWrapper = ({ children }: Props) => {
  return (
    <div className="hidden pt-3 px-3 shrink-0 lg:block w-[368px] sticky self-end lg:bottom-6 bottom-0 dark:border-white/10 dark:border rounded-md bg-white dark:bg-zinc-900  shadow-md">
      <div className="min-h-[calc(100vh-100px)] sticky top-6 flex flex-col gap-y-4">
        {children}
      </div>
    </div>
  );
};