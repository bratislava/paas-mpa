import { Text } from 'react-native'

import { CalendarIcon } from '@/assets/ui-icons'

const StatusBarShowCase = () => {
  return (
    <>
      <Text>See comments in the code for more details how to resize icon.</Text>
      {/* You can safely use icon without className to render it in standard size */}
      <CalendarIcon />
      {/* To specify size, use className width and height */}
      {/* <CalendarIcon className="h-4 w-4" /> */}
      {/* <CalendarIcon className="h-5 w-5" /> */}
      {/* <CalendarIcon className="h-6 w-6" /> */}
      {/* <CalendarIcon className="h-8 w-8" /> */}
      {/* /!* Passing icon as child to SMALLER flexbox kind of works *!/ */}
      {/* <View className="flex h-5 w-5 items-center justify-center"> */}
      {/*   <CalendarIcon /> */}
      {/* </View> */}
      {/* /!* However, to make it bigger or smaller properly, you need to address it with css as child */}
      {/*       This is useful when you expect icon as child, e.g. startIcon in Button *!/ */}
      {/* <View className="h-8 w-8 [&>svg]:h-full [&>svg]:w-full"> */}
      {/*   <CalendarIcon /> */}
      {/* </View> */}
    </>
  )
}

export default StatusBarShowCase
