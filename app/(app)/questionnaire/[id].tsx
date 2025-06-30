import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { WebView } from 'react-native-webview'

import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'
import { questionnaireOptions } from '@/modules/backend/constants/queryOptions'
import { cn } from '@/utils/cn'

export type QuestionnaireSearchParams = {
  id: string
}

const Page = () => {
  const { t } = useTranslation()
  const { id } = useLocalSearchParams<QuestionnaireSearchParams>()

  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false)

  const questionnaireId = Number(id)

  const isIdValid = !!id && !Number.isNaN(questionnaireId)

  const { data, isPending, isError } = useQuery(questionnaireOptions(questionnaireId, isIdValid))

  if (isPending) {
    return <LoadingScreen asScreenView />
  }

  if (isError) {
    return <ErrorScreen text={t('QuestionnaireScreen.error.text')} />
  }

  if (!isIdValid) {
    return <ErrorScreen text={t('QuestionnaireScreen.error.empty')} />
  }

  return (
    <>
      <ScreenView>
        <WebView
          source={{ uri: data.externalUrl }}
          onLoad={() => setIsWebViewLoaded(true)}
          className={cn('flex-1', { hidden: !isWebViewLoaded })}
        />
      </ScreenView>

      {/* Display loading overlay until WebView is fully loaded */}
      {isWebViewLoaded ? null : <LoadingScreen className="absolute h-full w-full bg-white/50" />}
    </>
  )
}

export default Page
