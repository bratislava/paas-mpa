import React from 'react'

import ZoneBadge from '@/components/info/ZoneBadge'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { TicketDto } from '@/modules/backend/openapi-generated'
import { useMapZone } from '@/state/MapZonesProvider/useMapZone'
import { formatDateTime } from '@/utils/formatDateTime'

type Props = {
  ticket: TicketDto
}

const BoughtTicket = ({ ticket }: Props) => {
  const locale = useLocale()
  const t = useTranslation('BoughtTicket')

  const zone = useMapZone(ticket.udr, true)

  return (
    <Field label={t('yourTicket')} labelInsertArea={<ZoneBadge label={ticket.udr} />}>
      <Panel className="g-4">
        <FlexRow>
          <Typography>{zone?.name}</Typography>
        </FlexRow>

        <Divider />

        <FlexRow>
          <Typography>{t('licencePlate')}</Typography>
          <Typography variant="default-bold">{ticket.ecv}</Typography>
        </FlexRow>

        <Divider />

        <FlexRow>
          <Typography>{t('validUntil')}</Typography>
          <Typography variant="default-bold">
            {formatDateTime(new Date(ticket.parkingEnd), locale)}
          </Typography>
        </FlexRow>
      </Panel>
    </Field>
  )
}

export default BoughtTicket
