import * as Localization from 'expo-localization'

import { clientApi } from '@/modules/backend/client-api'

// Inspiration from here: https://dev.to/ramonak/react-native-internationalization-with-i18next-568n#3-custom-plugin-to-store-chosen-language-in-the-local-storage

const enabledLocales = new Set(['en', 'sk'])

export const languageDetectorPlugin = {
  type: '3rdParty',
  async: true,
  init: () => {},
  detect: async (callback: (lang: string) => void) => {
    try {
      // get stored language from api
      const response = await clientApi.usersControllerGetUserSettings()
      const storedLocale = response?.data?.language

      if (storedLocale) {
        // if language was stored before, use this language in the app
        return callback(storedLocale)
      }

      const deviceLocale = Localization.locale.split('-')[0]

      const newLocale = enabledLocales.has(deviceLocale) ? deviceLocale : 'en'

      await clientApi.usersControllerSaveUserSettings({ language: newLocale })

      // if language was not stored yet, use device's locale or default language
      return callback(newLocale)
    } catch (error) {
      console.log('Error reading language', error)
    }

    return callback('en')
  },
}
