import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

export type ListGradientProps = {
  actionButton?: React.ReactNode
}

export const ListGradient = ({ actionButton }: ListGradientProps) => (
  <View className="absolute bottom-0 w-full">
    <LinearGradient
      pointerEvents="box-none"
      // From transparent to white
      colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
    >
      <View className="items-center px-5 py-2">{actionButton}</View>
    </LinearGradient>
  </View>
)
