import { useMutation } from '@tanstack/react-query'
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application'
import { router } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { ScrollView, TextInput as NativeTextInput } from 'react-native'

import TextInput from '@/components/inputs/TextInput'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import AccessibilityField from '@/components/shared/AccessibilityField'
import Button from '@/components/shared/Button'
import Chip from '@/components/shared/Chip'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { FeedbackDto, FeedbackType } from '@/modules/backend/openapi-generated'
import { isValidEmail as isValidEmailFunction } from '@/utils/isValidEmail'

const FeedbackScreen = () => {
  const { t } = useTranslation()

  const emailRef = useRef<NativeTextInput>(null)
  const messageRef = useRef<NativeTextInput>(null)

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [shouldVerifyEmail, setShouldVerifyEmail] = useState(false)
  const [shouldVerifyMessage, setShouldVerifyMessage] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'bug' | 'proposal'>('bug')

  const mutation = useMutation({
    mutationFn: (feedbackDto: FeedbackDto) => {
      return clientApi.systemControllerSendFeedback(feedbackDto)
    },
    onSuccess: () => {
      router.replace('/feedback/success')
      mutation.reset()
    },
    onError: () => {
      mutation.reset()
    },
  })

  const handleTypePress = useCallback(
    (type: 'bug' | 'proposal') => () => {
      setFeedbackType(type)
    },
    [],
  )

  const handleEmailFocus = useCallback(() => {
    setShouldVerifyEmail(false)
  }, [])
  const handleEmailBlur = useCallback(() => {
    setShouldVerifyEmail(true)
  }, [])
  const handleEmailSubmit = useCallback(() => {
    messageRef.current?.focus()
  }, [])

  const handleMessageFocus = useCallback(() => {
    setShouldVerifyMessage(false)
  }, [])
  const handleMessageBlur = useCallback(() => {
    setShouldVerifyMessage(true)
  }, [])

  const handleSubmit = useCallback(() => {
    const feedbackTypeValue: FeedbackType =
      feedbackType === 'bug' ? FeedbackType.NUMBER_0 : FeedbackType.NUMBER_1
    mutation.mutate({
      email: email.toLowerCase().trim(), // double check before sending to the backend
      message: `${message}\n\n(${nativeApplicationVersion} (${nativeBuildVersion}))`,
      type: feedbackTypeValue,
    })
  }, [email, feedbackType, message, mutation])

  const isValidEmail = !shouldVerifyEmail || (!!email && isValidEmailFunction(email))
  const isValidMessage = !shouldVerifyMessage || message.length > 0
  const isDisabled = !isValidEmail || !isValidMessage || !email || !message

  return (
    <DismissKeyboard>
      <ScreenView title={t('FeedbackScreen.title')}>
        <ScrollView>
          <ScreenContent>
            <AccessibilityField
              label={t('FeedbackScreen.emailAddress')}
              errorMessage={isValidEmail ? undefined : t('FeedbackScreen.emailAddressInvalid')}
            >
              <TextInput
                ref={emailRef}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onChangeText={(value) => setEmail(value.toLowerCase())}
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
                onSubmitEditing={handleEmailSubmit}
                hasError={!isValidEmail}
              />
            </AccessibilityField>
            <Field label={t('FeedbackScreen.type')}>
              <FlexRow>
                <PressableStyled onPress={handleTypePress('bug')} className="h-[48px] flex-1">
                  <Chip label={t('FeedbackScreen.bug')} isActive={feedbackType === 'bug'} />
                </PressableStyled>
                <PressableStyled onPress={handleTypePress('proposal')} className="h-[48px] flex-1">
                  <Chip
                    label={t('FeedbackScreen.proposal')}
                    isActive={feedbackType === 'proposal'}
                  />
                </PressableStyled>
              </FlexRow>
            </Field>
            <AccessibilityField
              style={{ flex: 1 }}
              label={t('FeedbackScreen.yourMessage')}
              helptext={
                feedbackType === 'bug' ? t('FeedbackScreen.yourMessage.helpText') : undefined
              }
              errorMessage={isValidMessage ? undefined : t('FeedbackScreen.yourMessageInvalid')}
            >
              <TextInput
                ref={messageRef}
                value={message}
                multiline
                className="h-auto grow"
                textAlignVertical="top"
                blurOnSubmit={false}
                numberOfLines={15}
                onChangeText={setMessage}
                onFocus={handleMessageFocus}
                onBlur={handleMessageBlur}
                hasError={!isValidMessage}
              />
            </AccessibilityField>
            <Button
              variant="primary"
              onPress={handleSubmit}
              loading={mutation.isPending}
              disabled={isDisabled}
            >
              {t('FeedbackScreen.send')}
            </Button>
          </ScreenContent>
        </ScrollView>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default FeedbackScreen
