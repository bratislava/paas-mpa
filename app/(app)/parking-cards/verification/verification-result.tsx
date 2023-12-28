import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { verifiedEmailsInfiniteOptions } from '@/modules/backend/constants/queryOptions'
import { VerifyEmailsDto } from '@/modules/backend/openapi-generated'

/*
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=1300%3A11943&mode=dev
 */

// TODO may need update depending on changes in figma
type VerificationResultSearchParams = {
  email: string
  status: 'verified' | 'verified-no-cards' | 'link-expired'
}

const VerificationResultPage = () => {
  const t = useTranslation('VerificationResult')
  const queryClient = useQueryClient()
  const navigation = useNavigation()
  const { email, status } = useLocalSearchParams<VerificationResultSearchParams>()

  queryClient.refetchQueries({ queryKey: verifiedEmailsInfiniteOptions().queryKey, type: 'active' })

  // TODO deduplicate this mutation (it's also used in ./index.tsx)
  const mutation = useMutation({
    mutationFn: (bodyInner: VerifyEmailsDto) =>
      clientApi.verifiedEmailsControllerSendEmailVerificationEmails(bodyInner),
    onSuccess: () => {
      router.replace({
        pathname: '/parking-cards/verification/verification-sent',
        params: { email },
      })
    },
  })

  const handleResendVerification = () => {
    const body: VerifyEmailsDto = {
      emails: [email ?? ''],
    }

    mutation.mutate(body)
  }

  useEffect(() => {
    if (status === 'link-expired') return

    const state = navigation.getState()
    const index = state.routes.findIndex((route) => (route.name as string).includes('purchase'))

    if (index === -1) {
      return
    }

    navigation.reset({
      ...state,
      index: index + 1,
      routes: [...state.routes.slice(0, index + 1), state.routes.at(-1)!],
    })
  }, [navigation, status])

  return (
    <ScreenViewCentered
      title={t('verificationResult')}
      hasBackButton
      actionButton={
        status === 'link-expired' ? (
          <ContinueButton onPress={handleResendVerification}>
            {t(`${status}.actionButtonLabel`)}
          </ContinueButton>
        ) : (
          <ContinueButton onPress={router.back}>{t(`${status}.actionButtonLabel`)}</ContinueButton>
        )
      }
    >
      {/* <Stack.Screen options={{ headerShown: false }} /> */}

      {email && status ? (
        <ContentWithAvatar
          variant={status.startsWith('verified') ? 'success' : 'error'}
          title={t(`${status}.title`)}
          text={t(`${status}.text`, { email })}
          asMarkdown
        />
      ) : (
        // TODO
        <ContentWithAvatar variant="error" title="Unexpected error" />
      )}
    </ScreenViewCentered>
  )
}

export default VerificationResultPage
