import NetInfo from '@react-native-community/netinfo'

import { getCurrentAuthenticatedUser } from '@/modules/cognito/utils'
import { getAndChangeUserLanguage } from '@/utils/getAndChangeUserLanguage'
import { getAppLocale } from '@/utils/getAppLocale'

// Inspiration from here: https://dev.to/ramonak/react-native-internationalization-with-i18next-568n#3-custom-plugin-to-store-chosen-language-in-the-local-storage

export const languageDetectorPlugin = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async (callback: (lang: string) => void) => {
    const appLocale = getAppLocale()

    // don't attempt getting user without internet connection, as that may result in unexpected logout due to https://github.com/aws-amplify/amplify-js/issues/10393
    const { isInternetReachable } = await NetInfo.fetch()
    if (isInternetReachable) {
      const currentUser = await getCurrentAuthenticatedUser()
      if (currentUser) {
        const userLocale = await getAndChangeUserLanguage()

        if (userLocale) {
          return callback(userLocale)
        }
      }
    }

    return callback(appLocale)
  },
} as const
