import { clientApi } from '@/modules/backend/client-api'
import { changeUserLanguageToDevice } from '@/utils/changeUserLanguageToDevice'

// Inspiration from here: https://dev.to/ramonak/react-native-internationalization-with-i18next-568n#3-custom-plugin-to-store-chosen-language-in-the-local-storage

export const languageDetectorPlugin = {
  type: 'languageDetector',
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
    } catch (error) {
      console.log('Error reading language', error)
    }

    const newLocale = await changeUserLanguageToDevice({ skipCheck: true })

    return callback(newLocale!)
  },
}
