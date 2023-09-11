import { View } from 'react-native'

import { CalendarIcon } from '@/assets/ui-icons'
import Typography from '@/components/shared/Typography'

const StatusBarShowCase = () => {
  return (
    <View className="p-4 g-2">
      <Typography>See comments in the code for more details how to resize icon.</Typography>
      {/* You can safely use icon without className to render it in standard size */}
      <CalendarIcon />
      {/* To specify size, use width and height */}
      <CalendarIcon width={20} height={20} />
      <CalendarIcon width={24} height={24} />
      <CalendarIcon width={32} height={32} />
      {/* Color */}
      <CalendarIcon className="text-green" />
      {/* Scaling icon as child using parent's dimensions */}
      <View className="h-[32px] w-[32px]">
        <CalendarIcon width="100%" height="100%" />
      </View>
    </View>
  )
}

export default StatusBarShowCase
