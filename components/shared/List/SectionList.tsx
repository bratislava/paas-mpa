import { FlashList, FlashListProps, ListRenderItem, ListRenderItemInfo } from '@shopify/flash-list'
import { useMemo } from 'react'
import { View } from 'react-native'

import { ListGradient, ListGradientProps } from '@/components/shared/List/ListGradient'

type Section<T, S extends string> = {
  title: S
  data: T[]
}

export type SectionListProps<T, S extends string> = Omit<
  FlashListProps<string | T>,
  'data' | 'renderItem'
> &
  Partial<ListGradientProps> & {
    sections: Section<T, S>[]
    stickySectionHeadersEnabled?: boolean
    SectionSeparatorComponent?: React.ComponentType<any>
    renderSectionHeader: (section: Section<T, S>) => JSX.Element | null
    renderItem: ListRenderItem<T> | null | undefined
  }

/**
 * High performance section list component with action button at the bottom
 * https://shopify.github.io/flash-list/docs/guides/section-list
 * @param estimatedItemSize is determined on the first render and is used to speed up the rendering... first time usage is without this prop and it logs warning where it is calculated next step is to use it in the component
 */
export const SectionList = <T extends any, S extends string>({
  actionButton,
  sections,
  ItemSeparatorComponent,
  SectionSeparatorComponent = () => null,
  stickySectionHeadersEnabled,
  renderItem,
  renderSectionHeader,
  ...props
}: SectionListProps<T, S>) => {
  const flatSections: (S | T)[] = useMemo(() => {
    return sections.flatMap((section) => [section.title, ...section.data])
  }, [sections])

  const getSection = (sectionData: ListRenderItemInfo<T | S>) => {
    return sections.find((s) => s.title === sectionData.item)
  }

  const stickyHeaderIndices: number[] = flatSections
    .map((item, index) => (typeof item === 'string' ? index : null))
    // TS thinks that it can be null even after filtering, so we need to assert it
    .filter((index) => index !== null) as number[]

  return (
    // Negative margin so the scroll bar is on the edge of the screen because of ScreenContent component
    <View className="mx-[-20px] flex-1">
      <FlashList
        {...props}
        data={flatSections}
        stickyHeaderIndices={stickySectionHeadersEnabled ? stickyHeaderIndices : undefined}
        ItemSeparatorComponent={
          ItemSeparatorComponent
            ? () => (
                <View className="px-5">
                  <ItemSeparatorComponent />
                </View>
              )
            : undefined
        }
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return typeof item === 'string' ? 'sectionHeader' : 'row'
        }}
        renderItem={
          renderItem
            ? (itemData) => (
                <View className="px-5">
                  {typeof itemData.item === 'string' ? (
                    <View>
                      {itemData.index !== 0 && <SectionSeparatorComponent />}
                      {renderSectionHeader(getSection(itemData) || { title: '' as S, data: [] })}
                    </View>
                  ) : (
                    renderItem(itemData as ListRenderItemInfo<T>)
                  )}
                </View>
              )
            : undefined
        }
      />

      {actionButton ? <ListGradient actionButton={actionButton} /> : null}
    </View>
  )
}
