type SupportedBrandNames = 'visa' | 'mastercard'

/**
 * Get the card brand name based on the first 6 and last 4 digits of the card
 * Currently supports VISA and MasterCard
 * @param mask first 6 and last 4 digits of the card
 */
export const getCardBrandName = (mask?: string): SupportedBrandNames | null => {
  if (!mask) return null

  if (mask.startsWith('4')) {
    return 'visa'
  }

  if (/^5[1-5]/.test(mask)) {
    return 'mastercard'
  }

  return null
}
