import { DateTimeFormatter, LocalDateTime } from '@js-joda/core'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import ScrollPickerNative, {
  ScrollHandle,
  ScrollPickerProps as ScrollPickerNativeProps,
} from '@/components/controls/date-time/lib/ScrollViewPicker'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import colors from '@/tailwind.config.colors'

/* Inspired by po-meste-native: https://github.com/bratislava/po-meste-native/blob/master/components/DateTimePicker.tsx
 * Read ts docs in ScrollViewPicker.tsx for more info.
 */

// similar to lodash range function, without step parameter
const range = (start: number, end: number) => {
  const inc = (end - start) / Math.abs(end - start)

  return Array.from(Array.from({ length: Math.abs(end - start) + 1 }), (_, i) => start + i * inc)
}

const formatter = DateTimeFormatter.ofPattern('d.M.')
const minutes = range(0, 60).map((value) => (value < 10 ? '0' : '') + value)
const hours = range(0, 24).map((value) => (value < 10 ? '0' : '') + value)

// TODO adjust heights of elements and wrapper if needed
const ScrollPicker = forwardRef<ScrollHandle, ScrollPickerNativeProps>((scrollPickerProps, ref) => {
  return (
    <ScrollPickerNative
      ref={ref}
      style={{ width: 100 }}
      dataSource={scrollPickerProps.dataSource}
      selectedIndex={scrollPickerProps.selectedIndex ?? 1}
      renderItem={(data, index) => (
        <View key={index}>
          <Typography variant="default-semibold">{data}</Typography>
        </View>
      )}
      onValueChange={scrollPickerProps.onValueChange}
      wrapperHeight={180}
      wrapperStyle={{
        width: 80,
        height: 180,
        ...scrollPickerProps.wrapperStyle,
      }}
      itemHeight={40}
      scrollViewComponent={ScrollView}
      highlightStyle={{
        width: 80,
        backgroundColor: colors.dark.light,
        borderRadius: 6,
        ...scrollPickerProps.highlightStyle,
      }}
    />
  )
})

interface DateTimePickerProps {
  onConfirm: (date: Date) => void
}

interface DateTimePickerHandles {
  setDate: (date: LocalDateTime) => void
}

export type DateTimePickerRef = DateTimePickerProps & DateTimePickerHandles

const CustomDateTimePicker = forwardRef<DateTimePickerHandles, DateTimePickerProps>(
  ({ onConfirm }, ref) => {
    const { t } = useTranslation()

    const [now, setNow] = useState(LocalDateTime.now())
    const [selectedHour, setSelectedHour] = useState<number>(now.hour())
    const [selectedMinute, setSelectedMinute] = useState<number>(now.minute())
    const [selectedDateIndex, setSelectedDateIndex] = useState<number>(7)
    const datePickerRef = useRef<ScrollHandle>(null)
    const hourPickerRef = useRef<ScrollHandle>(null)
    const minutePickerRef = useRef<ScrollHandle>(null)

    useImperativeHandle(ref, () => ({
      setDate: (date) => scrollToDate(date),
    }))

    const days = range(0, 15).map((value) => {
      const date = LocalDateTime.now()
      if (value < 7) return date.minusDays(7 - value).format(formatter)
      if (value === 7) return t('DateTimePicker.today')
      if (value === 8) return t('DateTimePicker.tomorrow')

      return date.plusDays(value - 7).format(formatter)
    })

    const scrollToDate = useCallback(
      (date: LocalDateTime) => {
        setSelectedHour(date.hour())
        hourPickerRef.current?.scrollTo(date.hour(), false)
        setSelectedMinute(date.minute())
        minutePickerRef.current?.scrollTo(date.minute(), false)
        setSelectedDateIndex(7)
        datePickerRef.current?.scrollTo(7, false)
      },
      [setSelectedHour, setSelectedMinute, setSelectedDateIndex],
    )

    useEffect(() => scrollToDate(LocalDateTime.now()), [scrollToDate])

    const handleConfirm = () => {
      let adjustedDate = now
      if (selectedDateIndex < 7) adjustedDate = now.minusDays(7 - selectedDateIndex)
      if (selectedDateIndex > 7) adjustedDate = now.plusDays(selectedDateIndex - 7)
      const selectedDatetime = new Date(
        adjustedDate.year(),
        adjustedDate.monthValue() - 1,
        adjustedDate.dayOfMonth(),
        selectedHour,
        selectedMinute,
      )
      onConfirm(selectedDatetime)
    }

    const handleNow = () => {
      const localNow = LocalDateTime.now()
      setNow(localNow)
      scrollToDate(localNow)
    }

    return (
      <View>
        <View className="self-center rounded border">
          <View className="flex-row bg-dark px-4 g-2">
            <View className="w-[160px] items-center">
              <Typography variant="small-semibold" className="text-white">
                {t('abbr.d')}
              </Typography>
            </View>
            <View className="w-[80px] items-center">
              <Typography variant="small-semibold" className="text-white">
                {t('abbr.h')}
              </Typography>
            </View>
            <View className="w-[80px] items-center">
              <Typography variant="small-semibold" className="text-white">
                {t('abbr.m')}
              </Typography>
            </View>
          </View>
          <View className="flex-row px-4 g-2">
            <ScrollPicker
              ref={datePickerRef}
              dataSource={days}
              selectedIndex={selectedDateIndex}
              wrapperStyle={{ width: 160 }}
              highlightStyle={{ width: 160 }}
              onValueChange={(value, index) => setSelectedDateIndex(index)}
            />
            <ScrollPicker
              ref={hourPickerRef}
              dataSource={hours}
              selectedIndex={selectedHour}
              onValueChange={(value) => setSelectedHour(+value)}
            />
            <ScrollPicker
              ref={minutePickerRef}
              dataSource={minutes}
              selectedIndex={selectedMinute}
              onValueChange={(value) => setSelectedMinute(+value)}
              // TODO investigate why this was here:
              // wrapperStyle={{ right: 1 }}
            />
          </View>
        </View>

        <View className="mt-6 g-4">
          <Button variant="plain-dark" onPress={handleNow}>
            {t('DateTimePicker.now')}
          </Button>

          <Button onPress={handleConfirm}>{t('DateTimePicker.set')}</Button>
        </View>
      </View>
    )
  },
)

export default CustomDateTimePicker
