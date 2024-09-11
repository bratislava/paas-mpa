import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ContinueButton from '@/components/navigation/ContinueButton'
import InfoSlide, { InfoSlideProps } from '@/components/screen-layout/InfoSlide'
import { cn } from '@/utils/cn'

type Props = InfoSlideProps & {
  onPress: () => void
}

export const PermissionsSlide = ({ title, text, SvgImage, onPress }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 justify-start">
      <InfoSlide title={title} text={text} SvgImage={SvgImage} />
      <ContinueButton className={cn('mx-5', { 'mb-5': !insets.bottom })} onPress={onPress} />
    </View>
  )
}
