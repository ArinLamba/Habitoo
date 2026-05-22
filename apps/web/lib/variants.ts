export const CELL_VARIANTS = {
  beforeStart: `
    dark:bg-pink-800/30
    bg-rose-800/30
    
    opacity-70
    cursor-not-allowed
    shadow-sm
  `,

  future: `
    bg-blue-900/30
    
    text-blue-500/70 dark:text-blue-400/70
    cursor-not-allowed
    shadow-sm scale-[0.97]
  `,

  completed: `
    shadow-sm
  `,

  skipped: `
    bg-amber-500/20
    hover:bg-amber-500/20
    text-amber-600
  `,

  failed: `
    bg-rose-500/20
    hover:bg-rose-500/30
    text-rose-600
  `,

  default: `
    bg-blue-900/20 dark:bg-blue-900/20
    hover:bg-gray-200 dark:hover:bg-zinc-700
  `,
};