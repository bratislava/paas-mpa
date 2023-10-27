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
import { formatDateTime } from '@/utils/formatDateTime'
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

  const validUntil = useMemo(
    () => formatDateTime(new Date(Date.now() + value * 1000), locale),
    [locale, value],
  )

  /**
   * Add 15 minutes
   */
  const addTime = () => {
    onValueChange(value + 15 * 60)
  }

  /**
   * Subtract 15 minutes
   */
  const subtractTime = () => {
    onValueChange(Math.max(0, value - 15 * 60))
  }

  const setTime = (value: number) => {
    onValueChange(value)
  }

  const chips = useMemo(
    () => [
      { value: 15 * 60, label: '15 min' },
      { value: 30 * 60, label: '30 min' },
      { value: 45 * 60, label: '45 min' },
      { value: 60 * 60, label: '1 h' },
      { value: 2 * 60 * 60, label: '2 h' },
      { value: 4 * 60 * 60, label: '4 h' },
      { value: 8 * 60 * 60, label: '8 h' },
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
      <FlexRow className="items-center">
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

      {/* Hardcoded h-[48px] prevents chips to shrink */}
      <View className="g-1">
        <View className="h-[48px] flex-row g-1">
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
        <View className="h-[48px] flex-row g-1">
          {chips.slice(4).map((chip) => {
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
