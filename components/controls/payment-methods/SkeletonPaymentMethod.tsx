import { View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

const SkeletonPaymentMethod = () => {
  return (
    <View className="flex-col">
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item gap={12}>
          <SkeletonPlaceholder.Item height={12} maxWidth={100} />
          <SkeletonPlaceholder.Item height={60} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  )
}

export default SkeletonPaymentMethod
