import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes Tailwind sem conflitos.
 * Uso: cn('px-4 py-2', condicao && 'bg-blue-500')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata uma data ISO para PT-BR
 */
export function formatDate(date?: string): string {
  if (!date) return new Date().toLocaleDateString('pt-BR')
  return new Date(date).toLocaleDateString('pt-BR')
}

/**
 * Tenta parsear um JSON com erro amigável
 */
export function safeParseJSON<T>(raw: string): { data: T; error: null } | { data: null; error: string } {
  try {
    const parsed = JSON.parse(raw)
    return { data: parsed as T, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'JSON inválido'
    return { data: null, error: `Erro ao parsear JSON: ${message}` }
  }
}

/**
 * Converte um valor qualquer para string legível
 */
export function valueToString(value: string | number | boolean): string {
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
  return String(value)
}
