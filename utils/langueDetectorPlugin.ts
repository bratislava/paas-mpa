import * as Localization from 'expo-localization'

import { storage } from '@/utils/mmkv'

export const STORAGE_LANGUAGE_KEY = 'settings.locale'

export const languageDetectorPlugin = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect(callback: (lang: string) => void) {
    // get stored language from storage
    const detectedLocale = storage.getString(STORAGE_LANGUAGE_KEY)

    if (detectedLocale) {
      // if language was stored before, use this language in the app
      return callback(detectedLocale)
    }

    // if language was not stored yet, use device's locale
    return callback(Localization.locale)
  },
  cacheUserLanguage(language: string) {
    // save a user's language choice in storage
    storage.set(STORAGE_LANGUAGE_KEY, language)
  },
}
