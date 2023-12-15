import { View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

const SkeletonPurchaseFields = () => {
  return (
    <View className="flex-col p-4">
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item gap={20}>
          {/* Vehicle */}
          <SkeletonPlaceholder.Item gap={12}>
            <SkeletonPlaceholder.Item height={12} maxWidth={80} />
            <SkeletonPlaceholder.Item height={60} />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item height={12} maxWidth={160} />
          <SkeletonPlaceholder.Item height={300} />

          <SkeletonPlaceholder.Item gap={12}>
            <SkeletonPlaceholder.Item height={12} maxWidth={100} />
            <SkeletonPlaceholder.Item height={60} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  )
}

export default SkeletonPurchaseFields
