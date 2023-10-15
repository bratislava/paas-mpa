import { router, useLocalSearchParams } from 'expo-router'

import { PurchaseSearchParams } from '@/app/purchase/index'
import DateTimePicker from '@/components/controls/date-time/DateTimePicker'
import Field from '@/components/shared/Field'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'

const getDuration = (date: Date) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()

  return Math.ceil(diff / 1000 / 60)
}

const Page = () => {
  const t = useTranslation('PurchaseScreen')
  const searchParams = useLocalSearchParams<PurchaseSearchParams>()

  return (
    <ScreenView title={t('customParkingTimeTitle')}>
      <ScreenContent>
        <Field label={t('customParkingTimeFieldLabel')}>
          <DateTimePicker
            onConfirm={(date) => {
              router.push({
                pathname: '/purchase/',
                params: { ...searchParams, duration: getDuration(date) },
              })
            }}
          />
        </Field>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
