import { Link } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import SegmentBadge from '@/components/info/SegmentBadge'
import Button from '@/components/shared/Button'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import Modal, { ModalContentWithActions } from '@/components/shared/Modal'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { TicketDto } from '@/modules/backend/openapi-generated'
import { useMapZone } from '@/state/hooks/useMapZone'
import { formatDateTime } from '@/utils/formatDateTime'

/*
 *  Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=2739%3A22754&mode=dev
 */

type Props = {
  ticket: TicketDto
}

const TicketCard = ({ ticket }: Props) => {
  const fromDateTime = new Date(ticket.parkingStart.replace('Z', ''))
  const toDateTime = new Date(ticket.parkingEnd.replace('Z', ''))
  const zone = useMapZone(ticket.udr, true)
  const t = useTranslation('Tickets.TicketCard')
  const locale = useLocale()
  const [isTerminateModalVisible, setIsTerminateModalVisible] = useState(false)

  const handleTerminateModalClose = () => setIsTerminateModalVisible(false)
  const handleTerminateModalOpen = () => setIsTerminateModalVisible(true)
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleTerminateTicket = () => false

  return (
    <>
      <Panel className="border border-divider bg-white">
        <View className="g-4">
          <FlexRow>
            <Typography variant="default-bold">
              {formatDateTime(fromDateTime, locale)} – {formatDateTime(toDateTime, locale)}
            </Typography>
            {/* TODO translation */}
            <IconButton name="more-vert" accessibilityLabel="More" />
          </FlexRow>
          <View className="items-start g-1">
            <SegmentBadge label={ticket.udr} />
            <Typography variant="small">
              {zone?.cityDistrict} – {zone?.name}
            </Typography>
            <Typography variant="small">Licence plate number</Typography>
          </View>
          <View className="g-2">
            <Link asChild href="/purchase">
              <Button>{t('prolong')}</Button>
            </Link>
            <Button variant="secondary" onPress={handleTerminateModalOpen}>
              {t('terminate')}
            </Button>
          </View>
        </View>
      </Panel>
      <Modal visible={isTerminateModalVisible} onRequestClose={handleTerminateModalClose}>
        <ModalContentWithActions
          variant="error"
          title={t('terminationModal.title')}
          text={t('terminationModal.message')}
          primaryActionLabel={t('terminationModal.actionConfirm')}
          primaryActionOnPress={handleTerminateTicket}
          secondaryActionLabel={t('terminationModal.actionCancel')}
          secondaryActionOnPress={handleTerminateModalClose}
        />
      </Modal>
    </>
  )
}

export default TicketCard
