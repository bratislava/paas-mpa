import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application'
import { ImagePickerAsset } from 'expo-image-picker'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'

import { FeedbackTypeSwitch } from '@/components/controls/feedback/FeedbackTypeSwitch'
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
import { FeedbackType, SERVICEERROR } from '@/modules/backend/openapi-generated'
import { isServiceError } from '@/utils/errorService'

type FormData = {
  email: string
  message: string
  type: 'bug' | 'proposal'
  files: ImagePickerAsset[]
}

type FeedbackMutationData = {
  type: FeedbackType
  email: string
  message: string
  appVersion?: string
  files?: Array<File>
}

const defaultValues: FormData = {
  email: '',
  message: '',
  type: 'bug',
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

  const watchedType = watch('type')

  const mutation = useMutation({
    mutationFn: (data: FeedbackMutationData) =>
      clientApi.systemControllerSendFeedback(
        data.type,
        data.email,
        data.message,
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
    (data: FormData) => {
      mutation.mutate({
        email: data.email.toLowerCase().trim(), // double check before sending to the backend
        message: data.message,
        type: data.type === 'bug' ? FeedbackType.NUMBER_0 : FeedbackType.NUMBER_1,
        appVersion: `${nativeApplicationVersion} (${nativeBuildVersion})`,
        files: data.files.map((file) => new File([file.uri], file.uri)),
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
                <FeedbackTypeSwitch value={value} onChange={(val) => setValue('type', val)} />
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
      </ScreenView>
    </DismissKeyboard>
  )
}

export default FeedbackScreen
