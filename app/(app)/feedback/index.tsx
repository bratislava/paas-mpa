import { useMutation } from '@tanstack/react-query'
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'

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

type FormData = {
  email: string
  message: string
  type: 'bug' | 'proposal'
}

const defaultValues: FormData = {
  email: '',
  message: '',
  type: 'bug',
}

const FeedbackScreen = () => {
  const { t } = useTranslation()

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues,
  })

  const watchedType = watch('type')

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

  const handleFormSubmit = useCallback(
    ({ email, message, type }: FormData) => {
      mutation.mutate({
        email: email.toLowerCase().trim(), // double check before sending to the backend
        message,
        type: type === 'bug' ? FeedbackType.NUMBER_0 : FeedbackType.NUMBER_1,
        appVersion: `${nativeApplicationVersion} (${nativeBuildVersion})`,
      })
    },
    [mutation],
  )

  return (
    <DismissKeyboard>
      <ScreenView title={t('FeedbackScreen.title')}>
        <ScrollView>
          <ScreenContent>
            <Controller
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: /.*@.*\..*/,
                  message: 'Email error',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AccessibilityField
                  label={t('FeedbackScreen.emailAddress')}
                  errorMessage={errors.email ? t('FeedbackScreen.emailAddressInvalid') : undefined}
                >
                  <TextInput
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    hasError={!!errors.email}
                  />
                </AccessibilityField>
              )}
              name="email"
            />

            <Controller
              control={control}
              name="type"
              render={({ field: { value } }) => (
                <Field label={t('FeedbackScreen.type')}>
                  <FlexRow>
                    <PressableStyled
                      onPress={() => setValue('type', 'bug')}
                      className="h-[48px] flex-1"
                    >
                      <Chip label={t('FeedbackScreen.bug')} isActive={value === 'bug'} />
                    </PressableStyled>
                    <PressableStyled
                      onPress={() => setValue('type', 'proposal')}
                      className="h-[48px] flex-1"
                    >
                      <Chip label={t('FeedbackScreen.proposal')} isActive={value === 'proposal'} />
                    </PressableStyled>
                  </FlexRow>
                </Field>
              )}
            />

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AccessibilityField
                  style={{ flex: 1 }}
                  label={t('FeedbackScreen.yourMessage')}
                  helptext={
                    watchedType === 'bug' ? t('FeedbackScreen.yourMessage.helpText') : undefined
                  }
                  errorMessage={errors.message ? t('FeedbackScreen.yourMessageInvalid') : undefined}
                >
                  <TextInput
                    value={value}
                    multiline
                    numberOfLines={10}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    hasError={!!errors.message}
                  />
                </AccessibilityField>
              )}
              name="message"
            />

            <Button
              variant="primary"
              onPress={handleSubmit(handleFormSubmit)}
              loading={mutation.isPending}
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
