import { View } from 'react-native'

import Icon from '@/components/shared/Icon'

const AvatarCircleNetworkOff = () => {
  return (
    <View className="flex items-center justify-center rounded-full bg-light p-4">
      <Icon name="wifi-off" className="text-black" size={24} />
    </View>
  )
}

export default AvatarCircleNetworkOff
