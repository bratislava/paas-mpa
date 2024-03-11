import cn from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-h1', 'text-h2', 'text-h3', 'text-base', 'text-sm'],
    },
  },
})

export const clsx = (...args: cn.ClassValue[]) => twMerge(cn(...args))
