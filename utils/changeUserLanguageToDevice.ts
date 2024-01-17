import * as Localization from 'expo-localization'

import { clientApi } from '@/modules/backend/client-api'

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

  let appLocale = enabledLocales.has(deviceLocale) ? deviceLocale : 'en'

  if (!options?.skipCheck) {
    const response = await clientApi.usersControllerGetUserSettings()
    const storedLocale = response?.data?.language

    if (storedLocale === appLocale) {
      return null
    }
    if (storedLocale) appLocale = storedLocale
  }

  try {
    await clientApi.usersControllerSaveUserSettings({ language: appLocale })
  } catch (error) {
    console.log('Error saving language', error)
  }

  return appLocale
}
