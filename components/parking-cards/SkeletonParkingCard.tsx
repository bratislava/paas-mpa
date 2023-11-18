import { View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

const SkeletonParkingCard = () => {
  return (
    <View className="flex-col rounded border border-divider p-4">
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item gap={12}>
          {/* Resident card */}
          <SkeletonPlaceholder.Item height={16} maxWidth={130} />
          <SkeletonPlaceholder.Item gap={16}>
            {/* Resident card - yearly */}
            <SkeletonPlaceholder.Item height={14} maxWidth={250} />
            {/* XX123XX */}
            <SkeletonPlaceholder.Item height={14} maxWidth={80} />

            {/* Divider  */}
            <SkeletonPlaceholder.Item height={2} />

            <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
              {/* Valid until  */}
              <SkeletonPlaceholder.Item width={80} height={14} />
              {/* Aug 25, 2023  */}
              <SkeletonPlaceholder.Item width={130} height={14} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  )
}

export default SkeletonParkingCard
