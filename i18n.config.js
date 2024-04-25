import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en, sk } from './translations'
import { languageDetectorPlugin } from '@/utils/languageDetectorPlugin'
import { environment } from './environment'

const resources = {
  en: {
    translation: en,
  },
  sk: {
    translation: sk,
  },
}

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'en',
    debug: environment.deployment === 'development',
  })

export default i18n
