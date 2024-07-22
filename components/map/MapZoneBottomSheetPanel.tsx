import { Link } from 'expo-router'
import { View } from 'react-native'

import { ZoneDetailsParams } from '@/app/(app)/zone-details'
import ZoneBadge from '@/components/info/ZoneBadge'
import ContinueButton from '@/components/navigation/ContinueButton'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { MapZoneStatusEnum } from '@/modules/map/constants'
import { MapUdrZone } from '@/modules/map/types'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { formatPricePerHour } from '@/utils/formatPricePerHour'
import { getPriceFromZone } from '@/utils/getPriceFromZone'

type Props = {
  selectedZone: MapUdrZone | null
}

const MapZoneBottomSheetPanel = ({ selectedZone }: Props) => {
  const { t } = useTranslation()
  const locale = useLocale()

  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  if (selectedZone) {
    const price = getPriceFromZone(selectedZone)

    return (
      <>
        <Panel className="g-4">
          <FlexRow>
            <Typography numberOfLines={1} className="flex-1 text-ellipsis">
              {selectedZone.name}
            </Typography>
            <View className="flex-0">
              <ZoneBadge label={selectedZone.udrId} />
            </View>
          </FlexRow>
          <Divider />
          <FlexRow>
            <Typography variant="default-bold">{formatPricePerHour(price, locale)}</Typography>
            <Link
              asChild
              href={{
                pathname: '/zone-details',
                params: {
                  udrId: selectedZone.udrId,
                } satisfies ZoneDetailsParams,
              }}
            >
              <PressableStyled>
                <View className="flex-row items-center">
                  <Typography variant="default-bold">{t('ZoneBottomSheet.showDetails')}</Typography>
                  <Icon name="chevron-right" />
                </View>
              </PressableStyled>
            </Link>
          </FlexRow>
        </Panel>

        {selectedZone.status === MapZoneStatusEnum.active ? (
          <Link
            asChild
            href="/purchase"
            onPress={() => onPurchaseStoreUpdate({ udr: selectedZone })}
          >
            <ContinueButton />
          </Link>
        ) : selectedZone.status === MapZoneStatusEnum.planned ? (
          <Panel className="bg-warning-light">
            <Typography>{t('ZoneBottomSheet.plannedZonePanelText')}</Typography>
          </Panel>
        ) : null}
      </>
    )
  }

  return (
    <Panel className="bg-warning-light g-2">
      <Typography>{t('ZoneBottomSheet.noZoneSelected')}</Typography>
    </Panel>
  )
}

export default MapZoneBottomSheetPanel
