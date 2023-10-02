import { Link, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { View } from 'react-native'

import { PurchaseSearchParams } from '@/app/purchase'
import Chip from '@/components/shared/Chip'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { formatDuration } from '@/utils/formatDuration'

type Props = {
  value: number // number of minutes
  onValueChange: (value: number) => void
}

const TimeSelector = ({ value, onValueChange }: Props) => {
  const t = useTranslation('TimeSelector')
  const locale = useLocale()
  const searchParams = useLocalSearchParams<PurchaseSearchParams>()
  const hrefObject = { pathname: '/purchase/custom-time', params: searchParams }

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

  return (
    <Panel className="g-4">
      <FlexRow cn="items-center">
        <IconButton
          variant="dark"
          name="remove"
          accessibilityLabel={t('subtractTimeButton')}
          onPress={subtractTime}
        />
        <Link asChild href={hrefObject}>
          <PressableStyled>
            <Typography variant="h1">{formatDuration(value)}</Typography>
          </PressableStyled>
        </Link>
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

          <Link asChild href={hrefObject}>
            <PressableStyled className="flex-1">
              <Chip label={t('custom')} isActive={isCustomTimeActive} />
            </PressableStyled>
          </Link>
        </View>
      </View>

      <Divider />

      <FlexRow>
        <Typography variant="small">{t('validUntil')}</Typography>

        <Link asChild href={hrefObject}>
          <PressableStyled>
            <Typography variant="small-bold">{validUntil}</Typography>
          </PressableStyled>
        </Link>
      </FlexRow>
    </Panel>
  )
}

export default TimeSelector
