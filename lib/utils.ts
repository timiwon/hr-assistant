import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export const getPagination = (page: number, perPage: number) => {
  const startIndex = page > 0 ? (page - 1) * perPage : 0; 
  const endIndex = startIndex + perPage - 1;
  return { startIndex, endIndex };
};