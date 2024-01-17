import clsx from 'clsx'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { WebView } from 'react-native-webview'

import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'

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
    <ScreenView>
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
