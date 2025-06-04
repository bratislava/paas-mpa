import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { WebView } from 'react-native-webview'

import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { cn } from '@/utils/cn'

export type QuestionerSearchParams = {
  id: string
}

const Page = () => {
  const { t } = useTranslation()
  const locale = useLocale()

  const { id } = useLocalSearchParams<QuestionerSearchParams>()

  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false)

  const isIdValid = !!id && !Number.isNaN(Number(id))

  const { data, isPending, isError } = useQuery({
    queryKey: ['questioner', id, locale],
    queryFn: async () => clientApi.feedbackFormsControllerGetFeedbackForm(+id),
    enabled: isIdValid,
    select: (res) => res.data,
  })

  if (isPending) {
    return <LoadingScreen asScreenView />
  }

  if (isError || !isIdValid) {
    return <ErrorScreen text={isError ? t('questioner.error.text') : t('questioner.error.empty')} />
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
