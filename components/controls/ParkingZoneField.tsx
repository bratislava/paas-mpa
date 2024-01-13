import { Link } from 'expo-router'

import ZoneBadge from '@/components/info/ZoneBadge'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { MapUdrZone } from '@/modules/map/types'
import { formatPricePerHour } from '@/utils/formatPricePerHour'
import { getPriceFromZone } from '@/utils/getPriceFromZone'

type Props = {
  zone: MapUdrZone | null
}

const ParkingZoneField = ({ zone }: Props) => {
  const t = useTranslation('PurchaseScreen')
  const price = zone ? formatPricePerHour(getPriceFromZone(zone)) : ''

  return (
    <Field
      label={t('segmentFieldLabel')}
      labelInsertArea={
        zone ? (
          <Link asChild href="/">
            <PressableStyled>
              <ZoneBadge label={zone.udrId} />
            </PressableStyled>
          </Link>
        ) : null
      }
    >
      <Link asChild href="/">
        <PressableStyled>
          <Panel>
            {zone ? (
              <FlexRow>
                <Typography>{zone.name}</Typography>
                <Typography variant="default-semibold">{price}</Typography>
              </FlexRow>
            ) : (
              // This should not happen, but this is a fallback if no zone is provided on this screen.
              <FlexRow>
                <Typography className="flex-1" variant="default-bold">
                  {t('chooseParkingZoneEmptyControlLabel')}
                </Typography>
                <Icon name="add" />
              </FlexRow>
            )}
          </Panel>
        </PressableStyled>
      </Link>
    </Field>
  )
}

export default ParkingZoneField
