import { useCallback, useState } from 'react'
import { View } from 'react-native'
import DatePicker from 'react-native-date-picker'

import { useLocale, useTranslation } from '@/hooks/useTranslation'

type Props = {
  onConfirm: (date: Date) => void
  onClose: () => void
  initialValue?: Date
  minimumDate?: Date
}

const DateTimePicker = ({ onConfirm, onClose, initialValue, minimumDate }: Props) => {
  const t = useTranslation('DateTimePicker')
  const [date, setDate] = useState(initialValue || new Date())
  const locale = useLocale()

  const handleDateChanged = useCallback((newDate: Date) => {
    setDate(newDate)
  }, [])

  const handleConfirm = useCallback(
    (newDate: Date) => {
      onConfirm(newDate)
      onClose()
    },
    [onConfirm, onClose],
  )

  const handleCancel = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <View>
      <DatePicker
        minimumDate={minimumDate || new Date()}
        // maximumDate={} // TODO set maximum time
        date={date}
        onDateChange={handleDateChanged}
        androidVariant="nativeAndroid"
        locale={locale}
        is24hourSource="locale"
        modal
        open
        title={t('selectDate')}
        cancelText={t('cancel')}
        confirmText={t('confirm')}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  )
}

export default DateTimePicker
