import { useLocalSearchParams } from 'expo-router'
import { ScrollView, View } from 'react-native'

import ScreenView from '@/components/shared/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'
import { MapPointKindEnum, MapZoneStatusEnum } from '@/modules/map/constants'

type FiltersParams = {
  [key in MapPointKindEnum]: 'true' | 'false'
} & {
  [key in MapZoneStatusEnum]: 'true' | 'false'
}

const FiltersScreen = () => {
  // reason for not passing the whole object: https://reactnavigation.org/docs/params/#what-should-be-in-params
  const zoneDetailsParams = useLocalSearchParams<FiltersParams>()
  const t = useTranslation()

  return (
    <ScreenView
      title={t('FiltersScreen.title')}
      continueProps={{ href: '/', label: t('FiltersScreen.showResults') }}
    >
      <ScrollView className="p-5 g-4">
        <View />
      </ScrollView>
    </ScreenView>
  )
}

export default FiltersScreen
