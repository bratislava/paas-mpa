import { router, useGlobalSearchParams } from 'expo-router'
import React from 'react'

import { PurchaseSearchParams } from '@/app/purchase/index'
import DateTimePicker from '@/components/controls/date-time/DateTimePicker'
import Field from '@/components/shared/Field'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('PurchaseScreen')
  const searchParams = useGlobalSearchParams<PurchaseSearchParams>()

  return (
    <ScreenView title={t('customParkingTimeTitle')}>
      <ScreenContent>
        <Field label={t('customParkingTimeFieldLabel')}>
          <DateTimePicker
            onConfirm={(date) => {
              router.push({
                pathname: '/purchase/',
                params: { ...searchParams, customParkingTime: date.toISOString() },
              })
            }}
          />
        </Field>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
