import { ScrollView, View } from 'react-native'

import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'

const SettingsPage = () => {
  const { t } = useTranslation()

  return (
    <ScreenView title={t('Settings.title')}>
      <ScreenContent className="flex-1">
        <ScrollView className="h-full" contentContainerStyle={{ gap: 20, flexGrow: 1 }}>
          <View />
        </ScrollView>
      </ScreenContent>
    </ScreenView>
  )
}

export default SettingsPage
