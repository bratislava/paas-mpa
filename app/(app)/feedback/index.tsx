import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application'
import { ImagePickerAsset } from 'expo-image-picker'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

import { FeedbackType, FeedbackTypeSwitch } from '@/components/controls/feedback/FeedbackTypeSwitch'
import { ImagePicker } from '@/components/inputs/ImagePicker/ImagePicker'
import TextInput from '@/components/inputs/TextInput'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import AccessibilityField from '@/components/shared/AccessibilityField'
import Button from '@/components/shared/Button'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { SERVICEERROR } from '@/modules/backend/openapi-generated'
import { isServiceError } from '@/utils/errorService'

type FormData = {
  email: string
  message: string
  feedbackType: FeedbackType
  files: ImagePickerAsset[]
}

type FeedbackMutationData = {
  feedbackType: FeedbackType
  email: string
  message: string
  appVersion?: string
  files?: Array<File>
}

const defaultValues: FormData = {
  email: '',
  message: '',
  feedbackType: 'BUG',
  files: [],
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

  const {
    fields: files,
    append: appendFiles,
    remove: removeFile,
  } = useFieldArray({
    control,
    name: 'files',
  })

  const watchedType = watch('feedbackType')

  const mutation = useMutation({
    mutationFn: (data: FeedbackMutationData) =>
      clientApi.systemControllerSendFeedback(
        data.feedbackType,
        data.email,
        data.message,
        undefined,
        data.appVersion,
        data.files,
      ),
    onSuccess: () => {
      router.replace('/feedback/success')
      mutation.reset()
    },
    onError: () => {
      mutation.reset()
    },
  })

  const handleFormSubmit = useCallback(
    async (data: FormData) => {
      mutation.mutate({
        email: data.email.toLowerCase().trim(), // double check before sending to the backend
        message: data.message,
        feedbackType: data.feedbackType,
        appVersion: `${nativeApplicationVersion} (${nativeBuildVersion})`,
        // TODO: Needs further investigation... something weird happens when we use new File() constructor here and the files are not sent correctly
        files: data.files.map((file) => ({
          uri: file.uri,
          type: file.mimeType,
          name: file.fileName,
        })) as unknown as File[],
      })
    },
    [mutation],
  )

  return (
    <DismissKeyboard>
      <ScreenView title={t('FeedbackScreen.title')}>
        <KeyboardAvoidingView
          className="h-full"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
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
                    errorMessage={
                      errors.email ? t('FeedbackScreen.emailAddressInvalid') : undefined
                    }
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
                name="feedbackType"
                render={({ field: { value } }) => (
                  <FeedbackTypeSwitch
                    value={value}
                    onChange={(val) => setValue('feedbackType', val)}
                  />
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
                      watchedType === 'BUG' ? t('FeedbackScreen.yourMessage.helpText') : undefined
                    }
                    errorMessage={
                      errors.message ? t('FeedbackScreen.yourMessageInvalid') : undefined
                    }
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

              {isAxiosError(mutation.error) &&
              isServiceError(mutation.error.response?.data) &&
              mutation.error.response.data.errorName === SERVICEERROR.UnsupportedFileType ? (
                <Typography className="text-negative">
                  {t('FeedbackScreen.attachFilesUnsupportedFileType')}
                </Typography>
              ) : undefined}

              <ImagePicker value={files} onAddFiles={appendFiles} onRemoveFile={removeFile} />

              <Button
                variant="primary"
                onPress={handleSubmit(handleFormSubmit)}
                loading={mutation.isPending}
              >
                {t('FeedbackScreen.send')}
              </Button>
            </ScreenContent>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default FeedbackScreen
