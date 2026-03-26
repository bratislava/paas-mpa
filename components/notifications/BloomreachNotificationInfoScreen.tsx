import { View } from 'react-native'

import Icon from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

type Props = {
  title: string
  items: string[]
  icon: React.ReactNode
}

export const BloomreachNotificationInfoScreenItem = ({ title, items, icon }: Props) => {
  return (
    <View className="items-start items-center gap-4">
      <View className="h-[168px] w-[168px]">{icon}</View>

      <View className="w-full flex-1 gap-3">
        <Typography variant="h2">{title}</Typography>
        {items.map((item) => (
          <View key={item} className="flex-row items-start gap-3">
            <Icon name="check" size={24} className="text-green" />

            <Typography className="flex-1">{item}</Typography>
          </View>
        ))}
      </View>
    </View>
  )
}
