import { Link } from 'expo-router'
import { View } from 'react-native'

import { ZoneDetailsParamas } from '@/app/(app)/zone-details'
import ZoneBadge from '@/components/info/ZoneBadge'
import ContinueButton from '@/components/navigation/ContinueButton'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { MapUdrZone } from '@/modules/map/types'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { formatPricePerHour } from '@/utils/formatPricePerHour'

type Props = {
  selectedZone: MapUdrZone | null
}

const MapZoneBottomSheetPanel = ({ selectedZone }: Props) => {
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()
  const t = useTranslation('ZoneBottomSheet')
  if (selectedZone) {
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
            <Typography variant="default-bold">{formatPricePerHour(selectedZone.price)}</Typography>
            <Link
              asChild
              href={{
                pathname: '/zone-details',
                params: {
                  udrId: selectedZone.udrId,
                } satisfies ZoneDetailsParamas,
              }}
            >
              <PressableStyled>
                <View className="flex-row">
                  <Typography variant="default-bold">{t('showDetails')}</Typography>
                  <Icon name="chevron-right" />
                </View>
              </PressableStyled>
            </Link>
          </FlexRow>
        </Panel>

        <Link asChild href="/purchase" onPress={() => onPurchaseStoreUpdate({ udr: selectedZone })}>
          <ContinueButton />
        </Link>
      </>
    )
  }

  return (
    <Panel className="bg-warning-light g-2">
      <Typography>{t('noZoneSelected')}</Typography>
    </Panel>
  )
}

export default MapZoneBottomSheetPanel
