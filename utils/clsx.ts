import cn from 'clsx'
import { twMerge } from 'tailwind-merge'

export const clsx = (...args: cn.ClassValue[]) => twMerge(cn(...args))
