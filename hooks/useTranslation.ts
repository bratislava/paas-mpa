import { useTranslation as useTranslationI18n } from 'react-i18next'

import { ApplicationLocale } from '@/modules/map/types'

/**
 * Simplified version of react-i18next useTranslation hook that helps to use it with keyPrefix.
 * Support for multiple namespaces has to be implemented if needed.
 * @param keyPrefix
 */
export const useTranslation = (keyPrefix?: string) => {
  const { t } = useTranslationI18n('translation', { keyPrefix })

  return { t }
}

export const useLocale = () => {
  const { i18n } = useTranslationI18n()

  return (i18n.resolvedLanguage ?? i18n.language) as ApplicationLocale
}
