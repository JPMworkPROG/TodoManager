import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata uma data no formato ISO 8601 para DD/MM/YYYY
 * @param isoDate - Data no formato ISO 8601 (ex: "2025-01-15" ou "2025-01-15T10:30:00Z")
 * @returns Data formatada no padrão DD/MM/YYYY
 */
export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)

    if (isNaN(date.getTime())) {
      return isoDate
    }

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  } catch {
    return isoDate
  }
}
