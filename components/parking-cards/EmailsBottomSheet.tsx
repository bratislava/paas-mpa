import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { forwardRef, useCallback, useRef, useState } from 'react'

import { ParkingCardsLocalSearchParams } from '@/app/(app)/parking-cards/[email]'
import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import PressableStyled from '@/components/shared/PressableStyled'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { verifiedEmailsInfiniteOptions } from '@/modules/backend/constants/queryOptions'

const EmailsBottomSheet = forwardRef<BottomSheetModal>((props, ref) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const localRef = useRef<BottomSheetModal>(null)
  const refSetter = useMultipleRefsSetter(localRef, ref)

  const { emailId } = useLocalSearchParams<ParkingCardsLocalSearchParams>()
  const parsedEmailId = emailId ? Number.parseInt(emailId, 10) : null

  const [isModalVisible, setIsModalVisible] = useState(false)

  const mutation = useMutation({
    mutationFn: (id: number) => clientApi.verifiedEmailsControllerDeleteVerifiedEmail(id),
    onSuccess: async () => {
      // Refetch verified emails
      await queryClient.refetchQueries({
        queryKey: verifiedEmailsInfiniteOptions().queryKey,
        type: 'active',
      })
    },
  })

  const handleRemoveEmailAccount = (id: number) => {
    // TODO handle error
    mutation.mutate(id, {
      onSuccess: (res) => {
        handleModalClose()
        router.navigate('/parking-cards')
      },
    })
  }

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleModalClose = () => {
    setIsModalVisible(false)
  }

  const handleModalOpen = () => {
    setIsModalVisible(true)
    localRef.current?.close()
  }

  // Double-check if emailId is valid number
  if (!parsedEmailId || Number.isNaN(parsedEmailId)) {
    return null
  }

  return (
    <>
      <BottomSheetModal
        ref={refSetter}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetContent>
          <PressableStyled onPress={handleModalOpen}>
            <ActionRow
              variant="negative"
              startIcon="delete"
              label={t('ParkingCards.emailActions.removeEmail')}
            />
          </PressableStyled>
        </BottomSheetContent>
      </BottomSheetModal>

      <Modal visible={isModalVisible} onRequestClose={handleModalClose}>
        <ModalContentWithActions
          variant="error"
          title={t('ParkingCards.removeEmailTitle')}
          text={t('ParkingCards.removeEmailText')}
          primaryActionLabel={t('ParkingCards.removeEmailConfirm')}
          secondaryActionLabel={t('ParkingCards.removeEmailCancel')}
          primaryActionOnPress={() => handleRemoveEmailAccount(parsedEmailId)}
          secondaryActionOnPress={handleModalClose}
        />
      </Modal>
    </>
  )
})

export default EmailsBottomSheet
