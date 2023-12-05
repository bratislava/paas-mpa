import { Image, ImageSourcePropType, View } from 'react-native'

import Typography from '@/components/shared/Typography'

type Props = {
  title: string
  text: string
  image: ImageSourcePropType
  className?: string
}

const InfoSlide = ({ title, text, image, className }: Props) => {
  return (
    <View className={className}>
      <Image source={image} className="w-full flex-shrink" />
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
