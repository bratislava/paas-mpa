import { Link } from 'expo-router'

import ZoneBadge from '@/components/info/ZoneBadge'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { NormalizedUdrZone } from '@/modules/map/types'
import { formatPricePerHour } from '@/utils/formatPricePerHour'

type Props = {
  zone: NormalizedUdrZone | null
}

const ParkingZoneField = ({ zone }: Props) => {
  const t = useTranslation('PurchaseScreen')

  return (
    <Field
      label={t('segmentFieldLabel')}
      labelInsertArea={
        zone ? (
          <Link asChild href="/">
            <PressableStyled>
              {/* TODO remove casting number/string */}
              <ZoneBadge label={zone.udrId.toString()} />
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
                <Typography variant="default-semibold">{formatPricePerHour(zone.price)}</Typography>
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
