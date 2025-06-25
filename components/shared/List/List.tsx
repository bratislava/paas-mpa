import { FlashList, FlashListProps } from '@shopify/flash-list'
import { View } from 'react-native'

import { ListGradient, ListGradientProps } from '@/components/shared/List/ListGradient'

export type ListProps<T> = FlashListProps<T> & Partial<ListGradientProps>

/**
 * High performance list component with action button at the bottom
 * https://shopify.github.io/flash-list/docs/usage
 * @param estimatedItemSize is determined on the first render and is used to speed up the rendering... first time usage is without this prop and it logs warning where it is calculated. Next step is to use it in the component
 */
export const List = <T extends any>({
  actionButton,
  ItemSeparatorComponent,
  renderItem,
  ...props
}: ListProps<T>) => {
  return (
    // Negative margin so the scroll bar is on the edge of the screen because of ScreenContent component
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

      {actionButton ? <ListGradient actionButton={actionButton} /> : null}
    </View>
  )
}
