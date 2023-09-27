import React from 'react'
import { View } from 'react-native'

import TimeSelector from '@/components/controls/date-time/TimeSelector'
import { useTimeSelector } from '@/hooks/useTimeSelector'

const TimeSelectorShowcase = () => {
  const { timeValue, setTimeValue } = useTimeSelector(60)

  return (
    <View className="p-4 g-4">
      <TimeSelector value={timeValue} onValueChange={setTimeValue} />
    </View>
  )
}

export default TimeSelectorShowcase
