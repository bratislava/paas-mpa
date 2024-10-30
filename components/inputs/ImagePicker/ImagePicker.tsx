import { ImagePickerAsset } from 'expo-image-picker'
import { Image, Pressable, View } from 'react-native'

import {
  ImagePickerButton,
  ImagePickerButtonProps,
} from '@/components/inputs/ImagePicker/ImagePickerButton'
import Icon from '@/components/shared/Icon'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/utils/cn'

type Props = ImagePickerButtonProps & {
  value: ImagePickerAsset[]
  onRemoveFile: (index: number) => void
}

export const ImagePicker = ({ value, onRemoveFile, ...props }: Props) => {
  const { t } = useTranslation()

  return (
    <View className={value.length > 0 ? 'g-5' : undefined}>
      <View
        className={cn('flex-row flex-wrap', {
          // React Native doesn't support calc('25% - 9px') therefore we added padding to each item and negative margin to the parent
          '-m-[6px]': value.length > 0,
        })}
      >
        {value.map((file, index) => (
          <View key={file.uri} className="relative aspect-square w-1/4 p-[6px]">
            <Image
              source={{ uri: file.uri }}
              className="h-full w-full rounded border-2 border-divider"
            />

            <Pressable
              accessibilityLabel={t('ImagePicker.removeImage')}
              className="absolute -right-[2px] -top-[6px] h-7 w-7 items-center justify-center rounded-full border border-white bg-negative-light"
              onPress={() => onRemoveFile(index)}
            >
              <Icon name="close" className="text-negative" size={16} />
            </Pressable>
          </View>
        ))}
      </View>

      <ImagePickerButton {...props} />
    </View>
  )
}
