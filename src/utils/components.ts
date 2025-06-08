import type { BanStatus } from '@/utils/interfaces'

/**
 * Prints the typeline of a monster card
 * @param typeline Typeline of `string` value
 */
export function printTypeline(typeline: string[] | undefined): string {
  let stringTypeline = ''
  if (typeline !== undefined) {
    typeline.forEach((t, idx) => {
      if (idx === 0) stringTypeline += t
      else stringTypeline += ` / ${t}`
    })
  }
  return stringTypeline
}

/**
 * Handle the text color depending on ban status
 * @param banStatus Ban status of either Forbidden, Limited, or Semi-Limited
 */
export function handleBanStatusColor(banStatus: BanStatus | undefined): string {
  switch (banStatus) {
    case 'Forbidden':
      return 'text-red-700 dark:text-red-400'
    case 'Limited':
      return 'text-orange-600 dark:text-orange-400'
    case 'Semi-Limited':
      return 'text-yellow-700 dark:text-yellow-400'
    default:
      return 'text-emerald-700 dark:text-emerald-500'
  }
}

/**
 * Remove two single quotes at the start and end of a string
 * @param str Flavor text of Normal and Normal Pendulum monsters
 */
export function removeSingleQuotes(str: string): string {
  if (str.startsWith("''") && str.endsWith("''") && str.length >= 4) return str.slice(2, -2)
  return str
}