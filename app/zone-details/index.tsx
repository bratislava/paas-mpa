import { useLocalSearchParams } from 'expo-router'
import { Feature, Polygon } from 'geojson'
import { useContext, useMemo } from 'react'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'
import { SelectedUdrZone } from '@/modules/map/types'
import { GlobalStoreContext } from '@/state/GlobalStoreProvider'

type ZoneDetailsParamas = {
  id: string
}

const ZoneDetailsScreen = () => {
  const zoneDetailsParams = useLocalSearchParams<ZoneDetailsParamas>()
  const globalStore = useContext(GlobalStoreContext)

  const id = Number.parseInt(zoneDetailsParams.id ?? '0', 10)

  const zone = useMemo(
    () => globalStore.mapFeatures?.get(id) as Feature<Polygon, SelectedUdrZone>,
    [id, globalStore.mapFeatures],
  )

  return (
    <View>
      <Typography>{zone?.properties.Nazov}</Typography>
    </View>
  )
}

export default ZoneDetailsScreen
