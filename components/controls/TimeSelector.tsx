import { Link } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

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
  // eslint-disable-next-line const-case/uppercase
  const customTimeScreen = '/purchase/custom-time'

  const addTime = () => {
    onValueChange(value + 15)
  }

  const subtractTime = () => {
    onValueChange(Math.max(0, value - 15))
  }

  const setTime = (minutes: number) => {
    onValueChange(minutes)
  }

  const chipRow1 = [{ value: 15 }, { value: 30 }, { value: 45 }, { value: 60 }]
  const chipRow2 = [{ value: 120 }, { value: 240 }, { value: 480 }]

  return (
    <Panel className="g-4">
      <FlexRow cn="items-center">
        <IconButton
          variant="dark"
          name="remove"
          accessibilityLabel={t('subtractTimeButton')}
          onPress={subtractTime}
        />
        <Link asChild href={customTimeScreen}>
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
          {chipRow1.map((chip) => {
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
          {chipRow2.map((chip) => {
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

          <Link asChild href={customTimeScreen}>
            <PressableStyled className="flex-1">
              <Chip label="Custom" />
            </PressableStyled>
          </Link>
        </View>
      </View>

      <Divider />

      <FlexRow>
        <Typography variant="small">Valid until</Typography>

        <Link asChild href={customTimeScreen}>
          <PressableStyled>
            <Typography variant="small-bold">12:00 TODO</Typography>
          </PressableStyled>
        </Link>
      </FlexRow>
    </Panel>
  )
}

export default TimeSelector
