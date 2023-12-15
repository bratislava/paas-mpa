import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import Button from '@/components/shared/Button'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { TicketDto } from '@/modules/backend/openapi-generated'
import { useMapZone } from '@/state/MapZonesProvider/useMapZone'
import { formatDateTime } from '@/utils/formatDateTime'

/*
 *  Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=2739%3A22754&mode=dev
 */

type Props = {
  ticket: TicketDto
  isActive?: boolean
  refetch: () => void
}

const TicketCard = ({ ticket, isActive, refetch }: Props) => {
  const parkingStartDate = new Date(ticket.parkingStart)
  const parkingEndDate = new Date(ticket.parkingEnd)
  const zone = useMapZone(ticket.udr, true)
  const t = useTranslation('TicketCard')
  const locale = useLocale()
  const [isShortenModalVisible, setIsShortenModalVisible] = useState(false)

  const shortenTicketMutation = useMutation({
    mutationFn: (id: number) => clientApi.ticketsControllerShortenTicket(id),
  })

  const queryClient = useQueryClient()

  const handleShortenModalClose = () => setIsShortenModalVisible(false)
  const handleShortenModalOpen = () => setIsShortenModalVisible(true)

  const handleShortenTicket = async () => {
    shortenTicketMutation.mutate(ticket.id, {
      onSuccess: () => {
        refetch()
        queryClient.removeQueries({ queryKey: ['Tickets'] })

        handleShortenModalClose()
      },
    })
  }

  // ticket can be shortened if there is no cancelledAt or duration is at least 15 minutes (parkingEnd - parkingStart)
  const canShorten =
    !ticket.canceledAt || parkingEndDate.getTime() - parkingStartDate.getTime() > 15 * 60 * 1000

  return (
    <>
      <Panel className="border border-divider bg-white">
        <View className="g-4">
          <FlexRow>
            {/* "flex-1" fixes text width to not overflow */}
            <Typography variant="default-bold" className="flex-1">
              {formatDateTime(parkingStartDate, locale)} – {formatDateTime(parkingEndDate, locale)}
            </Typography>
            <IconButton name="more-vert" accessibilityLabel={t('more')} />
          </FlexRow>

          <View className="items-start g-1">
            <ZoneBadge label={ticket.udr} />
            {zone ? (
              <Typography variant="small">
                {zone.cityDistrict} – {zone.name}
              </Typography>
            ) : null}
            <Typography variant="small">{ticket.ecv}</Typography>
          </View>

          {isActive && canShorten ? (
            <View className="g-2">
              <Link asChild href={`/prolongate/${ticket.id}`}>
                <Button>{t('prolong')}</Button>
              </Link>
              <Button variant="secondary" onPress={handleShortenModalOpen}>
                {t('shorten')}
              </Button>
            </View>
          ) : null}
        </View>
      </Panel>

      <Modal visible={isShortenModalVisible} onRequestClose={handleShortenModalClose}>
        <ModalContentWithActions
          variant="error"
          title={t('terminationModal.title')}
          isLoading={shortenTicketMutation.isPending}
          text={t('terminationModal.message')}
          primaryActionLabel={t('terminationModal.actionConfirm')}
          primaryActionOnPress={handleShortenTicket}
          secondaryActionLabel={t('terminationModal.actionCancel')}
          secondaryActionOnPress={handleShortenModalClose}
        />
      </Modal>
    </>
  )
}

export default TicketCard
