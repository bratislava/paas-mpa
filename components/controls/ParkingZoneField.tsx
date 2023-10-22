import { Link, useLocalSearchParams } from 'expo-router'

import SegmentBadge from '@/components/info/SegmentBadge'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useMapZone } from '@/state/hooks/useMapZone'
import { formatPricePerHour } from '@/utils/formatPricePerHour'

const ParkingZoneField = () => {
  const t = useTranslation('PurchaseScreen')

  const { udrId } = useLocalSearchParams<{ udrId: string }>()

  const zone = useMapZone(udrId ?? null, true)

  return (
    <Field
      label={t('segmentFieldLabel')}
      labelInsertArea={
        zone ? (
          <Link asChild href="/">
            <PressableStyled>
              {/* TODO remove casting number/string */}
              <SegmentBadge label={zone.udrId.toString()} />
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
