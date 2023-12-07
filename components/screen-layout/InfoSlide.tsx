import cslx from 'clsx'
import { FC } from 'react'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import Typography from '@/components/shared/Typography'

type Props = {
  title: string
  text: string
  SvgImage: FC<SvgProps>
  className?: string
}

const InfoSlide = ({ title, text, SvgImage, className }: Props) => {
  return (
    <View className={cslx('min-h-0 flex-1', className)}>
      <View className="min-h-0 w-full flex-shrink overflow-hidden">
        <SvgImage preserveAspectRatio="xMaxYMid slice" width="100%" />
      </View>
      <View className="flex-0 p-5 g-2">
        <Typography className="text-center" variant="h1">
          {title}
        </Typography>
        <Typography className="text-center">{text}</Typography>
      </View>
    </View>
  )
}

export default InfoSlide
