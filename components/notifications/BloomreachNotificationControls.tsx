import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

import SwitchControl from '@/components/controls/notifications/SwitchControl'
import ErrorScreen from '@/components/screen-layout/ErrorScreen'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import Field from '@/components/shared/Field'
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

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: consentsOptions().queryKey })
    },
  })

  if (query.isPending) {
    return <LoadingScreen />
  }

  if (query.isError) {
    return <ErrorScreen text={t('bloomreachNotifications.consents.error.text')} />
  }

  const getConsentValue = (category: ConsentItemDtoCategoryEnum) =>
    query.data?.consents.find((c) => c.category === category)?.valid ?? false

  const handleChange = (category: TrackConsentChangePropertiesDtoCategoryEnum, value: boolean) => {
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
      <Field label={t('bloomreachNotifications.fine.title')}>
        <SwitchControl
          title={t('bloomreachNotifications.fine.sms.title')}
          description={t('bloomreachNotifications.fine.sms.description')}
          accessibilityLabel={t('bloomreachNotifications.fine.sms.accessibilityLabel')}
          value={getConsentValue(ConsentItemDtoCategoryEnum.FineSms)}
          disabled={mutation.isPending}
          onValueChange={(value) =>
            handleChange(TrackConsentChangePropertiesDtoCategoryEnum.FineSms, value)
          }
        />
        <SwitchControl
          title={t('bloomreachNotifications.fine.push.title')}
          description={t('bloomreachNotifications.fine.push.description')}
          accessibilityLabel={t('bloomreachNotifications.fine.push.accessibilityLabel')}
          value={getConsentValue(ConsentItemDtoCategoryEnum.FinePush)}
          disabled={mutation.isPending}
          onValueChange={(value) =>
            handleChange(TrackConsentChangePropertiesDtoCategoryEnum.FinePush, value)
          }
        />
      </Field>

      <Field label={t('bloomreachNotifications.expiration.title')}>
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
      </Field>
    </>
  )
}
