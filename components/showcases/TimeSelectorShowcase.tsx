import React, { useState } from 'react'
import { View } from 'react-native'

import TimeSelector from '@/components/controls/date-time/TimeSelector'

const TimeSelectorShowcase = () => {
  const [timeValue, setTimeValue] = useState<number>(60 * 60)

  return (
    <View className="p-4 g-4">
      <TimeSelector value={timeValue} onValueChange={setTimeValue} />
    </View>
  )
}

export default TimeSelectorShowcase
