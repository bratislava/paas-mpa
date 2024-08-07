import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Platform } from 'react-native'
import { WebView } from 'react-native-webview'

import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { cn } from '@/utils/cn'

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
    // TODO investigate more (same issue is in purchase/payment.tsx) // WebView crashes on Android
    // in some cases, disabling animation helps //
    //   https://github.com/react-native-webview/react-native-webview/issues/3052#issuecomment-1635698194
    <>
      <ScreenView options={{ animation: Platform.OS === 'android' ? 'none' : undefined }}>
        <WebView
          source={{ uri: uriDecoded }}
          onLoad={() => setIsLoaded(true)}
          className={cn('flex-1', { hidden: !isLoaded })}
        />
      </ScreenView>

      {/* Display loading overlay until WebView is fully loaded */}
      {isLoaded ? null : <LoadingScreen className="absolute h-full w-full bg-white/50" />}
    </>
  )
}

export default Page
