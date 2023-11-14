import { ReactNode } from 'react'
import { FlatListProps } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

type Props<I> = FlatListProps<I> & {
  fetchNextPage: () => void
  renderSkeleton: () => ReactNode
  isLoading: boolean
}

const InfiniteScrollFlatList = <I,>({
  fetchNextPage,
  renderSkeleton,
  isLoading,
  ...restProps
}: Props<I>) => {
  return (
    <FlatList
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ gap: 12 }}
      {...restProps}
      onEndReached={fetchNextPage}
      onEndReachedThreshold={0.2}
      ListFooterComponent={isLoading ? renderSkeleton : null}
    />
  )
}

export default InfiniteScrollFlatList
