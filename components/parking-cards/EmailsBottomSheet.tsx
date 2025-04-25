import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { forwardRef, useCallback, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { useReducedMotion } from 'react-native-reanimated'

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
  const reducedMotion = useReducedMotion()

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

  // TODO handle error
  const handleRemoveEmailAccount = (id: number) => {
    mutation.mutate(id, {
      onSuccess: () => {
        handleModalClose()
        router.dismissTo('/parking-cards')
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
        // Nested accessible is a problem with Maestro on iOS so we need to disable it on parent
        // https://maestro.mobile.dev/platform-support/react-native#interacting-with-nested-components-on-ios
        accessible={Platform.select({
          ios: false,
        })}
        ref={refSetter}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        animateOnMount={!reducedMotion}
      >
        <BottomSheetContent>
          <PressableStyled testID="deleteEmailBottomSheetPressable" onPress={handleModalOpen}>
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
          isLoading={mutation.isPending}
        />
      </Modal>
    </>
  )
})

export default EmailsBottomSheet
