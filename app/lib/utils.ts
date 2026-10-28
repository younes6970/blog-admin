import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const PAGE_SZIE = 20

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
