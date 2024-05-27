import { useTranslation as useTranslationI18n } from 'react-i18next'

import { ApplicationLocale } from '@/modules/map/types'

/**
 *  TODO Remove, it's redundant
 */
export const useTranslation = () => {
  const { t } = useTranslationI18n('translation')

  return { t }
}

export const useLocale = () => {
  const { i18n } = useTranslationI18n()

  return (i18n.resolvedLanguage ?? i18n.language) as ApplicationLocale
}
