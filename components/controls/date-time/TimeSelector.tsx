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
import { useTranslation } from '@/hooks/useTranslation'
import { formatMinutes } from '@/utils/formatMinutes'

type Props = {
  value: number // number of minutes
  onValueChange: (value: number) => void
}

const TimeSelector = ({ value, onValueChange }: Props) => {
  const t = useTranslation('TimeSelector')
  const searchParams = useLocalSearchParams<PurchaseSearchParams>()
  // eslint-disable-next-line const-case/uppercase
  const customTimeScreen = '/purchase/custom-time'
  const hrefObject = { pathname: customTimeScreen, params: searchParams }

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
      { value: 15 },
      { value: 30 },
      { value: 45 },
      { value: 60 },
      { value: 120 },
      { value: 240 },
      { value: 480 },
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
            <Typography variant="h1">{formatMinutes(value)}</Typography>
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
                <Chip label={formatMinutes(chip.value)} isActive={chip.value === value} />
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
                <Chip label={formatMinutes(chip.value)} isActive={chip.value === value} />
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
            <Typography variant="small-bold">12:00 TODO</Typography>
          </PressableStyled>
        </Link>
      </FlexRow>
    </Panel>
  )
}

export default TimeSelector
