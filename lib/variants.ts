export const CELL_VARIANTS = {
  beforeStart: `
    bg-pink-800/30
    
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
    bg-amber-500/10
    
    hover:bg-amber-500/20
    text-amber-400
  `,

  failed: `
    bg-rose-500/10
    hover:bg-rose-500/20
    text-rose-400
  `,

  default: `
    bg-gray-100 dark:bg-zinc-800
    hover:bg-gray-200 dark:hover:bg-zinc-700
  `,
};