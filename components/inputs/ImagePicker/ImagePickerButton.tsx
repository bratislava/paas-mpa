import * as ImagePickerLib from 'expo-image-picker'

import Button from '@/components/shared/Button'
import { useTranslation } from '@/hooks/useTranslation'

export type ImagePickerButtonProps = {
  title?: string
  onAddFiles: (images: ImagePickerLib.ImagePickerAsset[]) => void
}

export const ImagePickerButton = ({ title, onAddFiles }: ImagePickerButtonProps) => {
  const { t } = useTranslation()

  const pickImage = async () => {
    const result = await ImagePickerLib.launchImageLibraryAsync({
      mediaTypes: ImagePickerLib.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    })

    if (!result.canceled) {
      onAddFiles(result.assets)
    }
  }

  return (
    <Button startIcon="attach-file" variant="tertiary" onPress={pickImage}>
      {title ?? t('ImagePicker.upload')}
    </Button>
  )
}
