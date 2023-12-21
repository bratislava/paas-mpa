import { router } from 'expo-router'
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
import {
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  TextInput as NativeTextInput,
  TextInputChangeEventData,
} from 'react-native'

import TextInput from '@/components/inputs/TextInput'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Chip from '@/components/shared/Chip'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'

const FeedbackScreen = () => {
  const t = useTranslation('FeedbackScreen')
  const emailRef = useRef<NativeTextInput>(null)
  const messageRef = useRef<NativeTextInput>(null)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [shouldVerifyEmail, setShouldVerifyEmail] = useState(false)
  const [shouldVerifyMessage, setShouldVerifyMessage] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'bug' | 'proposal'>('bug')

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
    router.replace('/feedback/success')
  }, [])

  const isValidEmail = !shouldVerifyEmail || !!email || email.includes('@')
  const isValidMessage = !shouldVerifyMessage || message.length > 0

  return (
    <ScreenView title={t('title')}>
      <Pressable onPress={Keyboard.dismiss} className="flex-1">
        <ScreenContent className="flex-1">
          <Field
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
            />
          </Field>
          <Field label={t('type')}>
            <FlexRow>
              {(['bug', 'proposal'] as const).map((label) => (
                <PressableStyled onPress={handleTypePress(label)} className="h-[48px] flex-1">
                  <Chip label={t(label)} key={label} isActive={feedbackType === label} />
                </PressableStyled>
              ))}
            </FlexRow>
          </Field>
          <Field
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
              numberOfLines={30}
              onChange={handleInputChange(setMessage)}
              onFocus={handleMessageFocus}
              onBlur={handleMessageBlur}
            />
          </Field>
          <Button variant="primary" onPress={handleSubmit}>
            {t('send')}
          </Button>
        </ScreenContent>
      </Pressable>
    </ScreenView>
  )
}

export default FeedbackScreen
