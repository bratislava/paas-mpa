import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { forwardRef, useCallback, useMemo } from 'react'
import { Platform } from 'react-native'

import { ParkingCardsLocalSearchParams } from '@/app/parking-cards/[email]'
import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { verifiedEmailsOptions } from '@/modules/backend/constants/queryOptions'

// TODO FIXME bottom sheet is empty on Android
const EmailsBottomSheet = forwardRef<BottomSheet>((props, ref) => {
  const t = useTranslation('ParkingCards')
  const queryClient = useQueryClient()
  const { emailId } = useLocalSearchParams<ParkingCardsLocalSearchParams>()
  const snapPoints = useMemo(() => [120], [])

  const parsedEmailId = emailId ? Number.parseInt(emailId, 10) : null

  const mutation = useMutation({
    mutationFn: (id: number) => clientApi.verifiedEmailsControllerDeleteVerifiedEmail(id),
    onSuccess: async () => {
      // Refetch verified emails
      await queryClient.refetchQueries({
        queryKey: verifiedEmailsOptions().queryKey,
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

  // Double-check if emailId is valid number
  if (!parsedEmailId || Number.isNaN(parsedEmailId)) {
    return null
  }

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={Platform.OS === 'android' ? snapPoints : undefined}
      enablePanDownToClose={Platform.OS === 'ios'}
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
