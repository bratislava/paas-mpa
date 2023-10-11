import { forwardRef, useCallback } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import Autocomplete, { AutocompleteProps } from '@/components/inputs/Autocomplete'
import { MapRef } from '@/components/map/Map'
import Icon from '@/components/shared/Icon'
import { GeocodingFeature } from '@/modules/map/types'
import { forwardGeocode } from '@/modules/map/utils/forwardGeocode'

type Props = {
  setFlyToCenter?: MapRef['setFlyToCenter']
} & Partial<AutocompleteProps<GeocodingFeature>>

const MapAutocomplete = forwardRef<RNTextInput, Props>(
  ({ setFlyToCenter, ...restProps }: Props, ref) => {
    const handleValueChange = useCallback(
      (value: GeocodingFeature) => {
        setFlyToCenter?.(value.center)
      },
      [setFlyToCenter],
    )

    return (
      <Autocomplete
        ref={ref}
        getOptions={forwardGeocode}
        getOptionLabel={(option) => option.place_name || option.text}
        onValueChange={handleValueChange}
        leftIcon={<Icon name="search" />}
        {...restProps}
      />
    )
  },
)

export default MapAutocomplete
