import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useMapZone } from '@/state/MapZonesProvider/useMapZone'
import { formatPricePerHour } from '@/utils/formatPricePerHour'
import { getPriceFromZone } from '@/utils/getPriceFromZone'

export type ZoneDetailsParams = {
  udrId: string
}

const ZoneDetailsScreen = () => {
  const { t } = useTranslation()

  // reason for not passing the whole object: https://reactnavigation.org/docs/params/#what-should-be-in-params
  const { udrId } = useLocalSearchParams<ZoneDetailsParams>()

  const zone = useMapZone(udrId ?? null, true)

  if (!zone) {
    return null
  }

  const price = getPriceFromZone(zone)

  const isAllWeekPrice = zone.weekendsAndHolidaysPrice == null

  return (
    <ScreenView title={t('ZoneDetailsScreen.title')}>
      <ScreenContent>
        <FlexRow>
          <ZoneBadge label={zone.udrId} />
          <Typography className="flex-1">{zone.name}</Typography>
          <Typography variant="default-bold">{formatPricePerHour(price)}</Typography>
        </FlexRow>

        <Divider />

        <FlexRow className="items-center justify-start">
          <View className="h-6 w-6 items-center justify-center rounded-full bg-dark">
            <Icon name="local-parking" size={12} className="text-white" />
          </View>
          <Typography variant="default-bold">{zone.reservedParking}</Typography>
        </FlexRow>

        <Divider />

        {zone.paidHours ? (
          <FlexRow className="justify-start">
            <Typography>{'\u2022'}</Typography>
            <Typography className="flex-1">
              {t('ZoneDetailsScreen.paidHours')}: {zone.paidHours}
            </Typography>
          </FlexRow>
        ) : null}
        {isAllWeekPrice || zone.price == null ? null : (
          <FlexRow className="justify-start">
            <Typography>{'\u2022'}</Typography>
            <Typography>
              {t('ZoneDetailsScreen.weekdaysPrice')}: {formatPricePerHour(zone.price)}
            </Typography>
          </FlexRow>
        )}
        {zone.weekendsAndHolidaysPrice == null ? null : (
          <FlexRow className="justify-start">
            <Typography>{'\u2022'}</Typography>
            <Typography>
              {t('ZoneDetailsScreen.weekendsAndHolidaysPrice')}: {formatPricePerHour(zone.weekendsAndHolidaysPrice)}
            </Typography>
          </FlexRow>
        )}
      </ScreenContent>
    </ScreenView>
  )
}

export default ZoneDetailsScreen
