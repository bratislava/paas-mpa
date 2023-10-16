import { Link } from 'expo-router'
import React from 'react'

import SegmentBadge from '@/components/info/SegmentBadge'
import TextInput from '@/components/inputs/TextInput'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useGlobalStoreContext } from '@/state/hooks/useGlobalStoreContext'
import { useMapZone } from '@/state/hooks/useMapZone'

const ParkingZoneControl = () => {
  const t = useTranslation('PurchaseScreen')

  const { ticketPriceRequest, setTicketPriceRequest } = useGlobalStoreContext()

  const zone = useMapZone(Number(ticketPriceRequest?.udr), true)

  if (!zone) {
    // TODO: temporary for development
    return (
      <TextInput
        value={ticketPriceRequest?.udr}
        onChangeText={(newUdr) =>
          setTicketPriceRequest((prev) => ({
            ...prev,
            udr: newUdr,
          }))
        }
      />
    )
  }

  return (
    <Field
      label={t('segmentFieldLabel')}
      labelInsertArea={
        <Link asChild href="/">
          <PressableStyled>
            <SegmentBadge label={zone.code} />
          </PressableStyled>
        </Link>
      }
    >
      <PressableStyled>
        <Panel>
          <FlexRow>
            <Typography>{zone.name}</Typography>
            <Typography variant="default-semibold">{zone.price}</Typography>
          </FlexRow>
        </Panel>
      </PressableStyled>
    </Field>
  )
}

export default ParkingZoneControl
