import { Link } from 'expo-router'

import ZoneBadge from '@/components/info/ZoneBadge'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { MapUdrZone } from '@/modules/map/types'
import { formatPricePerHour } from '@/utils/formatPricePerHour'
import { getPriceFromZone } from '@/utils/getPriceFromZone'

type Props = {
  zone: MapUdrZone | null
}

const ParkingZoneField = ({ zone }: Props) => {
  const { t } = useTranslation()
  const locale = useLocale()

  const price = zone ? formatPricePerHour(getPriceFromZone(zone), locale) : ''

  return (
    <Field
      label={t('PurchaseScreen.segmentFieldLabel')}
      labelInsertArea={
        zone ? (
          <Link asChild dismissTo href="/">
            <PressableStyled>
              <ZoneBadge label={zone.udrId} />
            </PressableStyled>
          </Link>
        ) : null
      }
    >
      <Link asChild href="/" dismissTo>
        <PressableStyled>
          <Panel>
            {zone ? (
              <FlexRow>
                <Typography numberOfLines={1} className="flex-1 text-ellipsis">
                  {zone.name}
                </Typography>
                <Typography variant="default-semibold">{price}</Typography>
              </FlexRow>
            ) : (
              // This should not happen, but this is a fallback if no zone is provided on this screen.
              <FlexRow>
                <Typography className="flex-1" variant="default-bold">
                  {t('PurchaseScreen.chooseParkingZoneEmptyControlLabel')}
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
