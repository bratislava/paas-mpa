import { ApplicationLocale } from '@/modules/map/types'

// It's safer to check and use specific locales instead of use toUpperCase(), because the array of supported languages may be different in FE / BE / paygate
export const getPaygateLanguageFromLocale = (locale: ApplicationLocale | null | undefined) => {
  return locale === 'sk' ? 'SK' : locale === 'en' ? 'EN' : undefined
}
