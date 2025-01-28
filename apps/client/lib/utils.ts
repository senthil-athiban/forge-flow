import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAuthenticated() : boolean {
  return !!getAccessToken();
}

export function getAccessToken() : string | null {
  return window.localStorage.getItem('accessToken');
}