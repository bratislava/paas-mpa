import { FC } from 'react'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import Typography from '@/components/shared/Typography'
import { cn } from '@/utils/cn'

type Props = {
  title: string
  text: string
  SvgImage: FC<SvgProps>
  className?: string
}

const InfoSlide = ({ title, text, SvgImage, className }: Props) => {
  return (
    <View className={cn('min-h-0 flex-1', className)}>
      {/* TODO if image gets deformed by scaling, try to use preserveAspectRatio */}
      <View className="relative aspect-square">
        <SvgImage width="100%" height="100%" />
      </View>

      <View className="p-5 g-2">
        <Typography className="text-center" variant="h1">
          {title}
        </Typography>
        <Typography className="text-center">{text}</Typography>
      </View>
    </View>
  )
}

export default InfoSlide
