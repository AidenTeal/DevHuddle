import { nameMap } from "@/constants/nameMap";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDeviconClassName = (name: string) => {
  const normalizedName = name.replace(/[.]/g, "").toLowerCase();

  return nameMap[normalizedName]
    ? `${nameMap[normalizedName]} colored`
    : "devicon-devicon-plain";
}