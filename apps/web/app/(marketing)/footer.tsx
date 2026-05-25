import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-zinc-950 px-5 py-8 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            alt="Habitoo logo"
            className="rounded-md"
            height={30}
            src="/logo.png"
            width={30}
          />
          <span className="text-sm font-extrabold">Habitoo</span>
        </div>
        <p className="text-sm font-semibold text-zinc-500">
          Build small. Log honestly. Keep going.
        </p>
      </div>
    </footer>
  );
};
