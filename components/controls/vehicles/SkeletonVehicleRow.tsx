import { View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

const SkeletonVehicleRow = () => {
  return (
    <View className="flex-col rounded bg-soft p-4">
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item gap={16}>
          <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" gap={40}>
            <SkeletonPlaceholder.Item flex={1} gap={10} flexDirection="column">
              <SkeletonPlaceholder.Item height={16} width={150} />
              <SkeletonPlaceholder.Item height={16} width={100} />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item height={20} width={10} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  )
}

export default SkeletonVehicleRow
