import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useMutation } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import React, { forwardRef, useCallback, useRef } from 'react'

import { ParkingCardsLocalSearchParams } from '@/app/parking-cards/[email]'
import ActionRow from '@/components/actions/ActionRow'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import PressableStyled from '@/components/shared/PressableStyled'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'

const EmailsBottomSheet = forwardRef<BottomSheet>((props, ref) => {
  const t = useTranslation('ParkingCards')
  const { emailId } = useLocalSearchParams<ParkingCardsLocalSearchParams>()
  const localRef = useRef<BottomSheet>(null)
  const refSetter = useMultipleRefsSetter(ref, localRef)

  const parsedEmailId = emailId ? Number.parseInt(emailId, 10) : null

  const mutation = useMutation({
    mutationFn: (id: number) => clientApi.verifiedEmailsControllerDeleteVerifiedEmail(id),
    onError: (error) => {
      // TODO handle error, show snackbar?
      // Handled in mutation to be sure that snackbar is shown on error
      console.log('error deleting email', error)
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

  // Double-check if emailId is valid number
  if (!parsedEmailId || Number.isNaN(parsedEmailId)) {
    return null
  }

  return (
    <BottomSheet
      ref={refSetter}
      index={-1}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetContent>
        <PressableStyled onPress={() => handleRemoveEmailAccount(parsedEmailId)}>
          <ActionRow variant="negative" startIcon="delete" label={t('emailActions.removeEmail')} />
        </PressableStyled>
      </BottomSheetContent>
    </BottomSheet>
  )
})

export default EmailsBottomSheet
