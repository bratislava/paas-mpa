import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en, sk } from './translations'
import { languageDetectorPlugin } from '@/utils/languageDetectorPlugin'
import { environment } from './environment'
import { clientApi } from '@/modules/backend/client-api'
import { Language as LanguageApiObject } from '@/modules/backend/openapi-generated'
import { Language } from '@/app/(app)/settings/language'

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

const languageMap: Record<Language, LanguageApiObject> = {
  sk: LanguageApiObject.Sk,
  en: LanguageApiObject.En,
}

i18n.on('languageChanged', async (lng: Language) => {
  if (!languageMap[lng]) return

  try {
    const response = await clientApi.resourcesControllerGetResources(languageMap[lng])

    i18n.addResources(
      lng,
      'translation',
      response.data.resources.reduce(
        (acc, resource) => ({
          ...acc,
          [resource.key]: resource.value,
        }),
        {},
      ),
    )
  } catch (error) {
    console.error('Failed to fetch resources (now using default ones):', error)
  }
})

export default i18n
