import * as Localization from 'expo-localization'

import { storage, STORAGE_LANGUAGE_KEY } from '@/utils/mmkv'

const ENABLED_LOCALES = new Set(['en', 'sk'])
const DEFAULT_LOCALE = 'en'

/**
 *  Function that gets user's language from mmkv or device's language if it was not set.
 */
export const getAppLocale = () => {
  const deviceLocale = Localization.getLocales()[0].languageCode || DEFAULT_LOCALE
  const mmkvLocale = storage.getString(STORAGE_LANGUAGE_KEY)

  return mmkvLocale ?? (ENABLED_LOCALES.has(deviceLocale) ? deviceLocale : DEFAULT_LOCALE)
}
