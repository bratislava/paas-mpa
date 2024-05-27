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
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { FeedbackDto, FeedbackType } from '@/modules/backend/openapi-generated'

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
    const feedbackTypeValue: FeedbackType =
      feedbackType === 'bug' ? FeedbackType.NUMBER_0 : FeedbackType.NUMBER_1
    mutation.mutate({
      email,
      message: `${message} (${nativeApplicationVersion} (${nativeBuildVersion}))`,
      type: feedbackTypeValue,
    })
  }, [email, feedbackType, message, mutation])

  const isValidEmail = !shouldVerifyEmail || (!!email && email.includes('@'))
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
                onChange={handleInputChange(setEmail)}
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
              {t('FeedbackScreen.send')}
            </Button>
          </ScreenContent>
        </ScrollView>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default FeedbackScreen
