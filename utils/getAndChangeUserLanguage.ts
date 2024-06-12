import { clientApi } from '@/modules/backend/client-api'
import { getAppLocale } from '@/utils/getAppLocale'

/**
 * Function that gets user's language and changes it in the backend if not set.
 * @returns new language if it was changed, null if it was not changed
 */
export const getAndChangeUserLanguage = async () => {
  const appLocale = getAppLocale()

  try {
    const response = await clientApi.usersControllerGetUserSettings()
    const apiLocale = response?.data?.language

    if (apiLocale === appLocale) {
      return null
    }
    if (apiLocale) {
      return apiLocale
    }
  } catch (error) {
    console.log('Error getting language', error)
  }

  try {
    await clientApi.usersControllerSaveUserSettings({ language: appLocale })
  } catch (error) {
    console.log('Error saving language', error)
  }

  return appLocale
}
