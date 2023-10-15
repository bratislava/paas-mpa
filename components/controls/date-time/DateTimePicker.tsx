import { useCallback, useState } from 'react'
import { View } from 'react-native'
import DatePicker from 'react-native-date-picker'

import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import i18next from 'i18next'

type Props = {
  onConfirm: (date: Date) => void
}

const ANNOTATION_WIDTHS = {
  en: { d: 155, h: 30, m: 30 },
  sk: { d: 160, h: 40, m: 40 },
}

const DateTimePicker = ({ onConfirm }: Props) => {
  const [date, setDate] = useState(new Date())
  const locale = useLocale()
  const t = useTranslation('DateTimePicker')

  const handleDateChanged = useCallback((newDate: Date) => {
    setDate(newDate)
  }, [])

  const handleConfirm = useCallback(() => {
    onConfirm(date)
  }, [date, onConfirm])

  const handleNow = useCallback(() => {
    setDate(new Date())
  }, [])

  return (
    <View>
      <View className="self-center rounded border">
        <View className="flex-row bg-dark px-4 g-2">
          {Object.entries(ANNOTATION_WIDTHS[locale]).map(([translationKey, width]) => (
            <View key={translationKey} className="items-center" style={{ width }}>
              <Typography variant="small-semibold" className="text-white">
                {t(`abbr.${translationKey}`)}
              </Typography>
            </View>
          ))}
          <View className="flex-1" />
        </View>

        <View className="flex-row px-4 g-2">
          <DatePicker
            minimumDate={new Date()}
            // maximumDate={} // TODO set maximum time
            date={date}
            onDateChange={handleDateChanged}
            androidVariant="iosClone"
            locale={locale}
            is24hourSource="locale"
          />
        </View>
      </View>

      <View className="mt-6 g-4">
        <Button variant="plain-dark" onPress={handleNow}>
          {t('now')}
        </Button>

        <Button onPress={handleConfirm}>{t('set')}</Button>
        <Button onPress={() => i18next.changeLanguage(locale === 'sk' ? 'en' : 'sk')}>
          Switch locale
        </Button>
      </View>
    </View>
  )
}

export default DateTimePicker
