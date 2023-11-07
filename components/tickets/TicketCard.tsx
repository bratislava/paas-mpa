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
import { TicketDto } from '@/modules/backend/openapi-generated'
import { useMapZone } from '@/state/MapZonesProvider/useMapZone'
import { formatDateTime } from '@/utils/formatDateTime'

/*
 *  Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=2739%3A22754&mode=dev
 */

type Props = {
  ticket: TicketDto
}

const TicketCard = ({ ticket }: Props) => {
  const parkingStartDate = new Date(ticket.parkingStart)
  const parkingEndDate = new Date(ticket.parkingEnd)
  const zone = useMapZone(ticket.udr, true)
  const t = useTranslation('TicketCard')
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
