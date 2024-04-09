import { useMutation } from '@tanstack/react-query'
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application'
import { router } from 'expo-router'
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
import {
  NativeSyntheticEvent,
  ScrollView,
  TextInput as NativeTextInput,
  TextInputChangeEventData,
} from 'react-native'

import TextInput from '@/components/inputs/TextInput'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import AccessibilityField from '@/components/shared/AccessibilityField'
import Button from '@/components/shared/Button'
import Chip from '@/components/shared/Chip'
import DismissKeyboard from '@/components/shared/DissmissKeyboard'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { FeedbackDto, FeedbackType } from '@/modules/backend/openapi-generated'

const FeedbackScreen = () => {
  const t = useTranslation('FeedbackScreen')

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

  const handleInputChange = useCallback(
    (setter: Dispatch<SetStateAction<string>>) =>
      (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setter(event.nativeEvent.text)
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
    // eslint-disable-next-line no-underscore-dangle
    const stringType: FeedbackType = feedbackType === 'bug' ? FeedbackType._0 : FeedbackType._1
    // TODO: bug fix, FeedbackType should be a number
    const type = Number.parseInt(stringType, 10)
    mutation.mutate({
      email,
      message: `${message} (${nativeApplicationVersion} (${nativeBuildVersion}))`,
      type: type as unknown as FeedbackType,
    })
  }, [email, feedbackType, message, mutation])

  const isValidEmail = !shouldVerifyEmail || (!!email && email.includes('@'))
  const isValidMessage = !shouldVerifyMessage || message.length > 0
  const isDisabled = !isValidEmail || !isValidMessage || !email || !message

  return (
    <DismissKeyboard>
      <ScreenView title={t('title')}>
        <ScrollView>
          <ScreenContent>
            <AccessibilityField
              label={t('emailAddress')}
              errorMessage={isValidEmail ? undefined : t('emailAddressInvalid')}
            >
              <TextInput
                ref={emailRef}
                value={email}
                onChange={handleInputChange(setEmail)}
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
                onSubmitEditing={handleEmailSubmit}
                hasError={!isValidEmail}
              />
            </AccessibilityField>
            <Field label={t('type')}>
              <FlexRow>
                {(['bug', 'proposal'] as const).map((label) => (
                  <PressableStyled
                    key={label}
                    onPress={handleTypePress(label)}
                    className="h-[48px] flex-1"
                  >
                    <Chip label={t(label)} key={label} isActive={feedbackType === label} />
                  </PressableStyled>
                ))}
              </FlexRow>
            </Field>
            <AccessibilityField
              style={{ flex: 1 }}
              label={t('yourMessage')}
              errorMessage={isValidMessage ? undefined : t('yourMessageInvalid')}
            >
              <TextInput
                ref={messageRef}
                value={message}
                multiline
                className="h-auto grow"
                textAlignVertical="top"
                blurOnSubmit={false}
                numberOfLines={15}
                onChange={handleInputChange(setMessage)}
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
              {t('send')}
            </Button>
          </ScreenContent>
        </ScrollView>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default FeedbackScreen
