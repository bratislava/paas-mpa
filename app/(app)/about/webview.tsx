import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { WebView } from 'react-native-webview'

import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'

export type WebviewSearchParams = {
  webviewUri: string
}

// TODO handle errors
const Page = () => {
  const { webviewUri } = useLocalSearchParams<WebviewSearchParams>()

  if (!webviewUri) {
    return <Typography>No uri provided.</Typography>
  }

  const uriDecoded = decodeURI(webviewUri)

  if (!uriDecoded) {
    return <Typography>Invalid uri provided.</Typography>
  }

  return (
    <ScreenView title=" " hasBackButton>
      <WebView source={{ uri: uriDecoded }} className="flex-1" />
    </ScreenView>
  )
}

export default Page
