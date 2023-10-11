import { useCallback } from 'react'

import Autocomplete from '@/components/inputs/Autocomplete'
import { MapRef } from '@/components/map/Map'
import { GeocodingFeature } from '@/modules/map/types'
import { forwardGeocode } from '@/modules/map/utils/forwardGeocode'

type Props = {
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const MapAutocomplete = ({ setFlyToCenter }: Props) => {
  const handleValueChange = useCallback(
    (value: GeocodingFeature) => {
      setFlyToCenter?.(value.center)
    },
    [setFlyToCenter],
  )

  return (
    <Autocomplete
      getOptions={forwardGeocode}
      getOptionLabel={(option) => option.place_name || option.text}
      onValueChange={handleValueChange}
    />
  )
}

export default MapAutocomplete
