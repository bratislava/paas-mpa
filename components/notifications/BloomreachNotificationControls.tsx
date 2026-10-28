import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { View } from 'react-native'

import SwitchControl from '@/components/controls/notifications/SwitchControl'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import Markdown from '@/components/shared/Markdown'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { consentsOptions } from '@/modules/backend/constants/queryOptions'
import {
  ConsentItemDtoCategoryEnum,
  ConsentResponseDto,
  TrackConsentChangeBodyDto,
  TrackConsentChangePropertiesDtoActionEnum,
  TrackConsentChangePropertiesDtoCategoryEnum,
} from '@/modules/backend/openapi-generated'

export const BloomreachNotificationControls = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const snackbar = useSnackbar()

  const query = useQuery(consentsOptions())

  const mutation = useMutation({
    mutationFn: (body: TrackConsentChangeBodyDto) =>
      clientApi.consentControllerTrackConsentChange(body),

    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: consentsOptions().queryKey })

      const previous = queryClient.getQueryData<AxiosResponse<ConsentResponseDto>>(
        consentsOptions().queryKey,
      )

      if (previous) {
        queryClient.setQueryData<AxiosResponse<ConsentResponseDto>>(consentsOptions().queryKey, {
          ...previous,
          data: {
            ...previous.data,
            consents: previous.data.consents.map((consent) =>
              consent.category === body.properties.category
                ? {
                    ...consent,
                    valid:
                      body.properties.action === TrackConsentChangePropertiesDtoActionEnum.Accept,
                  }
                : consent,
            ),
          },
        })
      }

      return { previous }
    },

    onError: (_error, _body, context) => {
      queryClient.setQueryData(consentsOptions().queryKey, context?.previous)
      snackbar.show(t('bloomreachNotifications.consents.mutationError'), { variant: 'danger' })
    },
  })

  if (query.isPending) {
    return <LoadingScreen />
  }

  if (query.isError) {
    return (
      <ContentWithAvatar
        variant="error"
        title={t('ErrorScreen.title')}
        text={t('bloomreachNotifications.consents.error.text')}
      />
    )
  }

  const getConsentValue = (category: ConsentItemDtoCategoryEnum) =>
    query.data.consents.find((consent) => consent.category === category)?.valid ?? false

  const handleChange = (category: TrackConsentChangePropertiesDtoCategoryEnum, value: boolean) => {
    // Connect Email and SMS settings - SMS notifications are allowed only when Email notifications are enabled.
    // When disabling Email notification, disable also SMS notification
    if (category === TrackConsentChangePropertiesDtoCategoryEnum.FineEmail && value === false) {
      mutation.mutate({
        properties: {
          action: TrackConsentChangePropertiesDtoActionEnum.Reject,
          category: TrackConsentChangePropertiesDtoCategoryEnum.FineSms,
          valid_until: 'unlimited',
        },
      })
    }
    // When enabling SMS notification, enable also Email notification
    if (category === TrackConsentChangePropertiesDtoCategoryEnum.FineSms && value === true) {
      mutation.mutate({
        properties: {
          action: TrackConsentChangePropertiesDtoActionEnum.Accept,
          category: TrackConsentChangePropertiesDtoCategoryEnum.FineEmail,
          valid_until: 'unlimited',
        },
      })
    }

    mutation.mutate({
      properties: {
        action: value
          ? TrackConsentChangePropertiesDtoActionEnum.Accept
          : TrackConsentChangePropertiesDtoActionEnum.Reject,
        category,
        valid_until: 'unlimited',
      },
    })
  }

  return (
    <>
      <Divider />

      <Field
        label={t('bloomreachNotifications.fine.title')}
        helptext={t('bloomreachNotifications.fine.description')}
      >
        <View className="pb-5 pt-2">
          <Markdown>{t('bloomreachNotifications.fine.viewFullText')}</Markdown>
        </View>

        <SwitchControl
          title={t('bloomreachNotifications.fine.email.title')}
          description={t('bloomreachNotifications.fine.email.description')}
          accessibilityLabel={t('bloomreachNotifications.fine.email.accessibilityLabel')}
          value={getConsentValue(ConsentItemDtoCategoryEnum.FineEmail)}
          // disabled={mutation.isPending}
          onValueChange={(value) =>
            handleChange(TrackConsentChangePropertiesDtoCategoryEnum.FineEmail, value)
          }
        />
        <SwitchControl
          title={t('bloomreachNotifications.fine.sms.title')}
          description={t('bloomreachNotifications.fine.sms.description')}
          accessibilityLabel={t('bloomreachNotifications.fine.sms.accessibilityLabel')}
          value={getConsentValue(ConsentItemDtoCategoryEnum.FineSms)}
          // disabled={mutation.isPending}
          onValueChange={(value) =>
            handleChange(TrackConsentChangePropertiesDtoCategoryEnum.FineSms, value)
          }
        />
        {/* <SwitchControl
          title={t('bloomreachNotifications.fine.push.title')}
          description={t('bloomreachNotifications.fine.push.description')}
          accessibilityLabel={t('bloomreachNotifications.fine.push.accessibilityLabel')}
          value={getConsentValue(ConsentItemDtoCategoryEnum.FinePush)}
          disabled={mutation.isPending}
          onValueChange={(value) =>
            handleChange(TrackConsentChangePropertiesDtoCategoryEnum.FinePush, value)
          }
        /> */}
      </Field>

      {/* <Field label={t('bloomreachNotifications.expiration.title')}>
        <SwitchControl
          title={t('bloomreachNotifications.expiration.email.title')}
          description={t('bloomreachNotifications.expiration.email.description')}
          accessibilityLabel={t('bloomreachNotifications.expiration.email.accessibilityLabel')}
          value={getConsentValue(ConsentItemDtoCategoryEnum.CardExpirationEmail)}
          disabled={mutation.isPending}
          onValueChange={(value) =>
            handleChange(TrackConsentChangePropertiesDtoCategoryEnum.CardExpirationEmail, value)
          }
        />
        <SwitchControl
          title={t('bloomreachNotifications.expiration.sms.title')}
          description={t('bloomreachNotifications.expiration.sms.description')}
          accessibilityLabel={t('bloomreachNotifications.expiration.sms.accessibilityLabel')}
          value={getConsentValue(ConsentItemDtoCategoryEnum.CardExpirationSms)}
          disabled={mutation.isPending}
          onValueChange={(value) =>
            handleChange(TrackConsentChangePropertiesDtoCategoryEnum.CardExpirationSms, value)
          }
        />
        <SwitchControl
          title={t('bloomreachNotifications.expiration.push.title')}
          description={t('bloomreachNotifications.expiration.push.description')}
          accessibilityLabel={t('bloomreachNotifications.expiration.push.accessibilityLabel')}
          value={getConsentValue(ConsentItemDtoCategoryEnum.CardExpirationPush)}
          disabled={mutation.isPending}
          onValueChange={(value) =>
            handleChange(TrackConsentChangePropertiesDtoCategoryEnum.CardExpirationPush, value)
          }
        />
      </Field> */}
    </>
  )
}
