import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { useMutation } from '@tanstack/react-query'
import React, { forwardRef, useCallback, useRef } from 'react'
import { Linking, View } from 'react-native'

import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import PressableStyled from '@/components/shared/PressableStyled'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'

type Props = {
  activeId: number | null
}

const TicketsHistoryBottomSheet = forwardRef<BottomSheetModal, Props>(({ activeId }, ref) => {
  const { t } = useTranslation()

  const localRef = useRef<BottomSheetModal>(null)
  const refSetter = useMultipleRefsSetter(localRef, ref)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const downloadReceiptMutation = useMutation({
    mutationFn: (id: number) => clientApi.ticketsControllerGetReceipt(id),
    onSuccess: async (res) => {
      await Linking.openURL(res.data)

      localRef.current?.close()
    },
  })

  const handleDownloadReceipt = () => {
    if (activeId) {
      downloadReceiptMutation.mutate(activeId)
    }
  }

  return (
    <BottomSheetModal
      ref={refSetter}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetContent>
        {downloadReceiptMutation.isPending ? (
          <View className="opacity-50">
            <ActionRow startIcon="hourglass-top" label={`${t('Tickets.downloading')}…`} />
          </View>
        ) : (
          <PressableStyled
            disabled={downloadReceiptMutation.isPending}
            onPress={handleDownloadReceipt}
          >
            <ActionRow startIcon="file-download" label={t('Tickets.downloadReceipt')} />
          </PressableStyled>
        )}
      </BottomSheetContent>
    </BottomSheetModal>
  )
})

export default TicketsHistoryBottomSheet
