import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { forwardRef, useCallback, useMemo, useState } from 'react'
import { Platform } from 'react-native'

import { ParkingCardsLocalSearchParams } from '@/app/(app)/parking-cards/[email]'
import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { verifiedEmailsInfiniteOptions } from '@/modules/backend/constants/queryOptions'

// TODO FIXME bottom sheet is empty on Android
const EmailsBottomSheet = forwardRef<BottomSheet>((props, ref) => {
  const t = useTranslation('ParkingCards')
  const queryClient = useQueryClient()
  const { emailId } = useLocalSearchParams<ParkingCardsLocalSearchParams>()
  const snapPoints = useMemo(() => [120], [])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const parsedEmailId = emailId ? Number.parseInt(emailId, 10) : null

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
    console.log('handleRemoveEmailAccount', emailId)
    mutation.mutate(id, {
      onSuccess: (res) => {
        console.log('success deleting email', res.data)
        router.push('/parking-cards')
      },
    })
  }

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false)
  }, [])
  const handleModalOpen = useCallback(() => {
    setIsModalVisible(true)
  }, [])

  // Double-check if emailId is valid number
  if (!parsedEmailId || Number.isNaN(parsedEmailId)) {
    return null
  }

  return (
    <>
      <BottomSheet
        ref={ref}
        index={-1}
        // Bug fix: disable dynamic sizing on android, add snap points
        snapPoints={Platform.OS === 'android' ? snapPoints : undefined}
        enableDynamicSizing={Platform.OS === 'ios'}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetContent>
          <PressableStyled onPress={handleModalOpen}>
            <ActionRow
              variant="negative"
              startIcon="delete"
              label={t('emailActions.removeEmail')}
            />
          </PressableStyled>
        </BottomSheetContent>
      </BottomSheet>

      <Modal visible={isModalVisible} onRequestClose={handleModalClose}>
        <ModalContentWithActions
          variant="error"
          title={t('removeEmailTitle')}
          text={t('removeEmailText')}
          primaryActionLabel={t('removeEmailConfirm')}
          secondaryActionLabel={t('removeEmailCancel')}
          primaryActionOnPress={() => handleRemoveEmailAccount(parsedEmailId)}
          secondaryActionOnPress={handleModalClose}
        />
      </Modal>
    </>
  )
})

export default EmailsBottomSheet
