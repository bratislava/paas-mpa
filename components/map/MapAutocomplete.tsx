import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { forwardRef, useCallback } from 'react'
import { ListRenderItem, TextInput as RNTextInput, View } from 'react-native'

import Autocomplete, { AutocompleteProps } from '@/components/inputs/Autocomplete'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { GeocodingFeature } from '@/modules/map/types'
import { forwardGeocode } from '@/modules/map/utils/forwardGeocode'

type Props = Partial<AutocompleteProps<GeocodingFeature>>

const MapAutocomplete = forwardRef<RNTextInput, Props>(
  ({ onValueChange, ...restProps }: Props, ref) => {
    const t = useTranslation('ZoneDetailsScreen')
    const handleValueChange = useCallback(
      (value: GeocodingFeature) => {
        onValueChange?.(value)
      },
      [onValueChange],
    )

    const renderItem: ListRenderItem<GeocodingFeature> = useCallback(
      ({ item }) => (
        <View className="border-b border-divider py-4">
          <FlexRow cn="g-4 items-center">
            <Icon name="location-pin" />
            <View className="flex-1">
              <Typography numberOfLines={1}>{item.text}</Typography>
              <Typography numberOfLines={1}>{item.place_name}</Typography>
            </View>
            <Icon name="chevron-right" />
          </FlexRow>
        </View>
      ),
      [],
    )

    return (
      <View>
        <Autocomplete
          ref={ref}
          getOptions={forwardGeocode}
          getOptionLabel={(option) => option.place_name || option.text}
          onValueChange={handleValueChange}
          leftIcon={<Icon name="search" />}
          resultsHeader={<Typography variant="h2">{t('searchResults')}</Typography>}
          renderItem={renderItem}
          ListComponent={BottomSheetFlatList}
          // disabledIndication={false}
          {...restProps}
        />
      </View>
    )
  },
)

export default MapAutocomplete
