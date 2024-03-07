import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Platform } from 'react-native'
import { WebView } from 'react-native-webview'

import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { clsx } from '@/utils/clsx'

export type WebviewSearchParams = {
  webviewUri: string
}

// TODO handle errors
const Page = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { webviewUri } = useLocalSearchParams<WebviewSearchParams>()

  if (!webviewUri) {
    return <Typography>No uri provided.</Typography>
  }

  const uriDecoded = decodeURI(webviewUri)

  if (!uriDecoded) {
    return <Typography>Invalid uri provided.</Typography>
  }

  return (
    // TODO investigate more (same issue is in purchase/payment.tsx)
    // WebView crashes on Android in some cases, disabling animation helps
    // https://github.com/react-native-webview/react-native-webview/issues/3052#issuecomment-1635698194
    <ScreenView options={{ animation: Platform.OS === 'android' ? 'none' : undefined }}>
      {isLoaded ? null : <LoadingScreen />}

      <WebView
        source={{ uri: uriDecoded }}
        onLoad={() => setIsLoaded(true)}
        className={clsx('flex-1', { hidden: !isLoaded })}
      />
    </ScreenView>
  )
}

export default Page
