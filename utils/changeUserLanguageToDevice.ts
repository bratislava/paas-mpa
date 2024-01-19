import * as Localization from 'expo-localization'

import { clientApi } from '@/modules/backend/client-api'
import { storage, STORAGE_LANGUAGE_KEY } from '@/utils/mmkv'

export const enabledLocales = new Set(['en', 'sk'])

type Options = {
  skipCheck?: boolean
}

/**
 * Function that changes user's language in the backend to the device's language.
 * @param options options.skipCheck - if true, we don't check if the language was already stored in the backend
 * @returns new language if it was changed, null if it was not changed
 */
export const changeUserLanguageToDevice = async (options?: Options) => {
  const deviceLocale = Localization.locale.split('-')[0]

  const mmkvLocale = storage.getString(STORAGE_LANGUAGE_KEY)

  let appLocale = mmkvLocale ?? (enabledLocales.has(deviceLocale) ? deviceLocale : 'en')

  if (!options?.skipCheck) {
    const response = await clientApi.usersControllerGetUserSettings()
    const apiLocale = response?.data?.language

    if (apiLocale === appLocale) {
      return null
    }
    if (apiLocale) appLocale = apiLocale
  }

  try {
    await clientApi.usersControllerSaveUserSettings({ language: appLocale })
  } catch (error) {
    console.log('Error saving language', error)
  }

  return appLocale
}
