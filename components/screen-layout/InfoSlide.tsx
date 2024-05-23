import clsx from 'clsx'
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
    <View className={clsx('min-h-0 flex-1', className)}>
      <View className="aspect-square min-h-0 w-full flex-shrink overflow-hidden">
        {/* TODO if image gets deformed by scaling, try to use preserveAspectRatio */}
        <SvgImage width="100%" height="100%" />
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
