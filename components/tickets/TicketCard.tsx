import { Link } from 'expo-router'
import { View } from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import Button from '@/components/shared/Button'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { TicketDto } from '@/modules/backend/openapi-generated'
import { useMapZone } from '@/state/MapZonesProvider/useMapZone'
import { formatDateTime } from '@/utils/formatDateTime'

/*
 *  Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=2739%3A22754&mode=dev
 */

type Props = {
  ticket: TicketDto
  isActive?: boolean
  handleMorePress: (id: number) => void
}

const TicketCard = ({ ticket, isActive, handleMorePress }: Props) => {
  const { t } = useTranslation()
  const locale = useLocale()

  const parkingStartDate = new Date(ticket.parkingStart)
  const parkingEndDate = new Date(ticket.parkingEnd)
  const zone = useMapZone(ticket.udr, true)

  // Ticket can be shortened if duration is at least 15 minutes (parkingEnd - parkingStart) or parking cards were used.
  const canShorten =
    ticket.bpkCreditUsedSeconds ||
    ticket.npkCreditUsedSeconds ||
    parkingEndDate.getTime() - parkingStartDate.getTime() > 15 * 60 * 1000

  return (
    <Panel className="border border-divider bg-white">
      <View className="g-4">
        <FlexRow>
          {/* "flex-1" fixes text width to not overflow */}
          <Typography variant="default-bold" className="flex-1">
            {formatDateTime(parkingStartDate, locale)} – {formatDateTime(parkingEndDate, locale)}
          </Typography>

          {isActive ? null : (
            <IconButton
              name="more-vert"
              accessibilityLabel={t('TicketCard.more')}
              onPress={() => handleMorePress(ticket.id)}
            />
          )}
        </FlexRow>

        <View className="items-start g-1">
          <ZoneBadge label={ticket.udr} />
          {zone ? (
            <Typography variant="small">
              {zone.cityDistrict} - {zone.name}
            </Typography>
          ) : null}
          <Typography variant="small">{ticket.ecv}</Typography>
        </View>

        {isActive && !ticket.canceledAt ? (
          <View className="g-2">
            <Link asChild href={`/prolongate/${ticket.id}`}>
              <Button>{t('TicketCard.prolong')}</Button>
            </Link>

            {canShorten ? (
              <Link
                asChild
                href={{
                  pathname: '/tickets/shorten',
                  params: {
                    ticketId: ticket.id,
                  },
                }}
              >
                <Button variant="secondary">{t('TicketCard.shorten')}</Button>
              </Link>
            ) : null}
          </View>
        ) : null}
      </View>
    </Panel>
  )
}

export default TicketCard
