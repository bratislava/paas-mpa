import { View } from 'react-native'

import MapPinSvg from '@/assets/ui-icons/map-pin.svg'
import MapPinNoZoneSvg from '@/assets/ui-icons/map-pin-no-zone.svg'
import { useScreenCenter } from '@/modules/map/hooks/useScreenCenter'

import Typography from '../shared/Typography'

interface Props {
  price?: number
}

const PIN_WIDTH = 56
const PIN_HEIGHT = 98

const MapPin = ({ price }: Props) => {
  const screenCenter = useScreenCenter()
  const position = {
    top: screenCenter.top - PIN_HEIGHT + 4,
    left: screenCenter.left - PIN_WIDTH / 2,
  }
  const pinSize = { width: PIN_WIDTH, height: PIN_HEIGHT }

  return (
    <>
      <View className="absolute items-center" style={position}>
        {price ? <MapPinSvg {...pinSize} /> : <MapPinNoZoneSvg {...pinSize} />}
        {price && (
          <Typography variant="small-bold" className="absolute text-white">
            {price} €
          </Typography>
        )}
      </View>
      {/* This red point is the exact center of the screen, I would leave it there for now for testing */}
      <View className="absolute" style={{ top: screenCenter.top, left: screenCenter.left }}>
        <View className="h-[1px] w-[1px] bg-[#f00]" />
      </View>
    </>
  )
}

export default MapPin
