import { Linking, Platform } from 'react-native'

const appStoreId = 'id6457264414'
const playStoreId = 'com.bratislava.paas'

const nativeStoreUrl =
  Platform.OS === 'ios'
    ? `itms-apps://itunes.apple.com/app/id${appStoreId}`
    : `market://details?id=${playStoreId}`

const webStoreUrl =
  Platform.OS === 'ios'
    ? `https://apps.apple.com/app/${appStoreId}`
    : `https://play.google.com/store/apps/details?id=${playStoreId}`

export const navigateToStore = () => Linking.openURL(webStoreUrl)

const reviewSuffix = Platform.OS === 'ios' ? '?action=write-review' : '&showAllReviews=true'

export const navigateToStoreReview = async () => {
  try {
    const supported = await Linking.canOpenURL(nativeStoreUrl)

    await Linking.openURL((supported ? nativeStoreUrl : webStoreUrl) + reviewSuffix)
  } catch (error) {
    console.error('An error occurred while opening the review page:', error)
  }
}
