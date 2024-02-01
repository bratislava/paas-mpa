import { useState } from 'react'
import { View } from 'react-native'

import SwitchControl from '@/components/controls/notifications/SwitchControl'
import Switch from '@/components/shared/Switch'
import Typography from '@/components/shared/Typography'

const SwitchShowcase = () => {
  const [checked, setChecked] = useState(false)

  return (
    <View className="p-4 g-4">
      <View className="flex-row g-3">
        <Switch />
        <Typography>Uncontrolled (should not work, see RN docs)</Typography>
      </View>
      <View className="flex-row g-3">
        <Switch value={checked} onValueChange={setChecked} />
        <Typography>Controlled {checked ? 'checked' : 'unchecked'}</Typography>
      </View>
      <SwitchControl
        accessibilityLabel="Switch control"
        title="Switch control"
        description="Optional description"
        value={checked}
        onValueChange={setChecked}
      />
    </View>
  )
}

export default SwitchShowcase
