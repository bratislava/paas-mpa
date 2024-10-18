import { FlashList, FlashListProps } from '@shopify/flash-list'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

export type ListProps<T> = FlashListProps<T> & {
  actionButton?: React.ReactNode
}

/**
 * High performance list component with action button at the bottom
 * @param estimatedItemSize is determined on the first render and is used to speed up the rendering... first time usage is without this prop and it logs warning where it is calculated next step is to use it in the component
 */
export const List = <T extends any>({
  actionButton,
  ItemSeparatorComponent,
  renderItem,
  ...props
}: ListProps<T>) => {
  return (
    <View className="mx-[-20px] flex-1">
      <FlashList
        {...props}
        ItemSeparatorComponent={
          ItemSeparatorComponent
            ? () => (
                <View className="px-5">
                  <ItemSeparatorComponent />
                </View>
              )
            : undefined
        }
        renderItem={
          renderItem ? (item) => <View className="px-5">{renderItem(item)}</View> : undefined
        }
      />

      <View className="absolute bottom-0 w-full">
        <LinearGradient
          pointerEvents="box-none"
          // From transparent to white
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
        >
          <View className="items-center px-5 py-2">{actionButton}</View>
        </LinearGradient>
      </View>
    </View>
  )
}
