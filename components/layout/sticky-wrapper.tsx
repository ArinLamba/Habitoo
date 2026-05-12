type Props = {
  children: React.ReactNode;
};

export const StickyWrapper = ({
  children,
}: Props) => {
  return (
    <div
      className="
        hidden lg:flex
        fixed
        right-10
        top-[60px]
        h-[calc(100vh-65px)]
        w-[320px]
        flex-col
        gap-y-4
        border-l
        border-white/10
        bg-white
        dark:bg-zinc-900
        p-3
        shadow-md
      "
    >
      {children}
    </div>
  );
};