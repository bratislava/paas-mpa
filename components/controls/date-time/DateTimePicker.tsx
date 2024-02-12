import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import DatePicker from 'react-native-date-picker'

import { useLocale } from '@/hooks/useTranslation'

type Props = {
  onConfirm: (date: Date) => void
  onClose: () => void
  open: boolean
}

const DateTimePicker = ({ onConfirm, onClose, open }: Props) => {
  const [date, setDate] = useState(new Date())
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

  useEffect(() => {
    if (open) {
      setDate(new Date())
    }
  }, [open])

  return (
    <View>
      <DatePicker
        minimumDate={new Date()}
        // maximumDate={} // TODO set maximum time
        date={date}
        onDateChange={handleDateChanged}
        androidVariant="nativeAndroid"
        locale={locale}
        is24hourSource="locale"
        modal
        open={open}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  )
}

export default DateTimePicker
