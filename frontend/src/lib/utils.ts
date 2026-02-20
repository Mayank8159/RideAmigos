import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind classes and handles conditional logic
 * Example: cn("p-4", isActive && "bg-orange-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format coordinates for display in the Rider Room
 */
export function formatCoords(lng: number, lat: number) {
  return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`
}