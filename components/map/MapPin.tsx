import { View } from 'react-native'

import { MapPinIcon, MapPinNoZoneIcon } from '@/assets/map'
import Typography from '@/components/shared/Typography'
import { useMapCenter } from '@/modules/map/hooks/useMapCenter'

type Props = {
  price?: number
}

const PIN_WIDTH = 56
const PIN_HEIGHT = 98

const MapPin = ({ price }: Props) => {
  const screenCenter = useMapCenter()
  const position = {
    top: screenCenter.top - PIN_HEIGHT + 4,
    left: screenCenter.left - PIN_WIDTH / 2,
  }
  const pinSize = { width: PIN_WIDTH, height: PIN_HEIGHT }

  return (
    <View className="absolute items-center" pointerEvents="none" style={position}>
      {price ? <MapPinIcon {...pinSize} /> : <MapPinNoZoneIcon {...pinSize} />}
      {price && (
        // TODO formatPrice
        <Typography variant="small-bold" className="absolute text-white">
          {price} €
        </Typography>
      )}
    </View>
  )
}

export default MapPin
