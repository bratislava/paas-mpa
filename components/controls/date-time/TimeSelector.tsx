import { useMemo, useState } from 'react'
import { View } from 'react-native'

import DateTimePicker from '@/components/controls/date-time/DateTimePicker'
import Chip from '@/components/shared/Chip'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { formatDuration } from '@/utils/formatDuration'

const getDuration = (date: Date) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()

  return Math.ceil(diff / 1000 / 60)
}

type Props = {
  value: number // number of minutes
  onValueChange: (value: number) => void
}

const TimeSelector = ({ value, onValueChange }: Props) => {
  const t = useTranslation('TimeSelector')
  const locale = useLocale()
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const now = useMemo(() => new Date(), [])
  const validUntil = useMemo(
    () =>
      new Date(now.getTime() + value * 60 * 1000).toLocaleDateString(locale, {
        minute: '2-digit',
        hour: 'numeric',
        day: 'numeric',
        month: 'short',
        weekday: 'long',
      }),
    [locale, now, value],
  )

  const addTime = () => {
    onValueChange(value + 15)
  }

  const subtractTime = () => {
    onValueChange(Math.max(0, value - 15))
  }

  const setTime = (minutes: number) => {
    onValueChange(minutes)
  }

  const chips = useMemo(
    () => [
      { value: 15, label: '15 min' },
      { value: 30, label: '30 min' },
      { value: 45, label: '45 min' },
      { value: 60, label: '1 h' },
      { value: 120, label: '2 h' },
      { value: 240, label: '4 h' },
      { value: 480, label: '8 h' },
    ],
    [],
  )

  const isCustomTimeActive = chips.every((chip) => chip.value !== value)

  const handleDatePickerOpen = () => {
    setDatePickerOpen(true)
  }

  const handleDatePickerClose = () => {
    setDatePickerOpen(false)
  }

  const handleDatePickerConfirm = (date: Date) => {
    const duration = getDuration(date)
    onValueChange(duration)
  }

  return (
    <Panel className="g-4">
      <FlexRow cn="items-center">
        <IconButton
          variant="dark"
          name="remove"
          accessibilityLabel={t('subtractTimeButton')}
          onPress={subtractTime}
        />
        <PressableStyled onPress={handleDatePickerOpen}>
          <Typography variant="h1">{formatDuration(value)}</Typography>
        </PressableStyled>
        <IconButton
          variant="dark"
          name="add"
          accessibilityLabel={t('addTimeButton')}
          onPress={addTime}
        />
      </FlexRow>
      <View className="g-1">
        <View className="flex-row g-1">
          {chips.slice(0, 4).map((chip) => {
            return (
              <PressableStyled
                key={chip.value}
                onPress={() => setTime(chip.value)}
                className="flex-1"
              >
                <Chip label={chip.label} isActive={chip.value === value} />
              </PressableStyled>
            )
          })}
        </View>
        <View className="flex-row g-1">
          {chips.slice(4).map((chip) => {
            return (
              <PressableStyled
                key={chip.value}
                onPress={() => setTime(Number(chip.value))}
                className="flex-1"
              >
                <Chip label={chip.label} isActive={chip.value === value} />
              </PressableStyled>
            )
          })}

          <PressableStyled className="flex-1" onPress={handleDatePickerOpen}>
            <Chip label={t('custom')} isActive={isCustomTimeActive} />
          </PressableStyled>
        </View>
      </View>

      <Divider />

      <FlexRow>
        <Typography variant="small">{t('validUntil')}</Typography>
        <PressableStyled onPress={handleDatePickerOpen}>
          <Typography variant="small-bold">{validUntil}</Typography>
        </PressableStyled>
      </FlexRow>
      <DateTimePicker
        open={datePickerOpen}
        onClose={handleDatePickerClose}
        onConfirm={handleDatePickerConfirm}
      />
    </Panel>
  )
}

export default TimeSelector
