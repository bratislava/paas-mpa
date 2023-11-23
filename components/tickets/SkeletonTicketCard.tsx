import { View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

const SkeletonTicketCard = () => {
  return (
    <View className="flex-col rounded border border-divider p-4">
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item gap={16}>
          <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" gap={40}>
            <SkeletonPlaceholder.Item flex={1} gap={10} flexDirection="column">
              {/* Mon, Oct 30, 5:09 OM - Mon, Oct */}
              <SkeletonPlaceholder.Item height={16} />
              {/* 30, 6:09 PM */}
              <SkeletonPlaceholder.Item height={16} width={100} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item height={20} width={10} />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item gap={4}>
            <SkeletonPlaceholder.Item height={20} width={60} />
            <SkeletonPlaceholder.Item height={14} />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item height={14} width={60} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  )
}

export default SkeletonTicketCard
