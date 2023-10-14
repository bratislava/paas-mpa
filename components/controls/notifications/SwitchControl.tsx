import React from 'react'
import { SwitchProps, View } from 'react-native'

import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import Switch from '@/components/shared/Switch'
import Typography from '@/components/shared/Typography'

export type SwitchControlProps = {
  title: string
  description?: string
  value: boolean
  onValueChange: SwitchProps['onValueChange']
}

const SwitchControl = ({ title, description, value, onValueChange }: SwitchControlProps) => {
  return (
    <Panel>
      <FlexRow>
        <View className="flex-1">
          <Typography variant="default-bold">{title}</Typography>
          {description ? <Typography>{description}</Typography> : null}
        </View>

        <View>
          <Switch value={value} onValueChange={onValueChange} />
        </View>
      </FlexRow>
    </Panel>
  )
}

export default SwitchControl
