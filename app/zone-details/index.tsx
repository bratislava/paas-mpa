import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

import SegmentBadge from '@/components/info/SegmentBadge'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useMapZone } from '@/state/hooks/useMapZone'

type ZoneDetailsParamas = {
  id: string
}

const ZoneDetailsScreen = () => {
  // reason for not passing the whole object: https://reactnavigation.org/docs/params/#what-should-be-in-params
  const zoneDetailsParams = useLocalSearchParams<ZoneDetailsParamas>()
  const t = useTranslation()

  const id = Number.parseInt(zoneDetailsParams.id ?? '0', 10)

  const zone = useMapZone(id, true)

  if (!zone) {
    return null
  }

  return (
    <ScreenView title={t('ZoneDetailsScreen.title')} continueProps={{ href: 'purchase' }}>
      <View className="p-5 g-4">
        <FlexRow>
          <SegmentBadge label={zone.UDR_ID.toString()} />
          <Typography className="flex-1">{zone.Nazov}</Typography>
          <Typography variant="default-bold">{`${zone.Zakladna_cena}€ / h`}</Typography>
        </FlexRow>
        <Divider />
        <FlexRow cn="justify-start">
          <View
            className="h-6 w-6 items-center justify-center bg-dark"
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ borderRadius: 12 }}
          >
            <Icon name="local-parking" size={12} className="text-white" />
          </View>
          <Typography variant="default-bold">{zone.Vyhradene_park_statie_en}</Typography>
        </FlexRow>
        <Divider />
        <FlexRow cn="justify-start">
          <Typography>{'\u2022'}</Typography>
          <Typography>{zone.Doplnkova_informacia_en}</Typography>
        </FlexRow>
      </View>
    </ScreenView>
  )
}

export default ZoneDetailsScreen
