import { useRouter } from 'expo-router'
import { View } from 'react-native'

import CityAccountImage from '@/assets/images/city-account-image.svg'
import Icon from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

export const ConnectWithCityAccountMenuLink = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const handlePress = () => {
    router.push('/settings/notifications')
  }

  return (
    <PressableStyled className="w-full overflow-hidden rounded bg-light" onPress={handlePress}>
      <CityAccountImage width="100%" preserveAspectRatio="xMidYMid slice" />

      <View className="flex-row items-center justify-between p-3 g-2">
        <Typography variant="default-bold">
          {t('bloomreachNotifications.button.connectWithCityAccount')}
        </Typography>

        <Icon name="chevron-right" />
      </View>
    </PressableStyled>
  )
}
