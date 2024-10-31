import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { useCallback, useRef, useState } from 'react'
import { useReducedMotion } from 'react-native-reanimated'

import PaymentMethodRow from '@/components/controls/payment-methods/rows/PaymentMethodRow'
import SkeletonPaymentMethod from '@/components/controls/payment-methods/SkeletonPaymentMethod'
import { PaymentMethod } from '@/components/controls/payment-methods/types'
import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useModal } from '@/components/screen-layout/Modal/useModal'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import { SectionList } from '@/components/shared/List/SectionList'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useDefaultPaymentMethod } from '@/hooks/useDefaultPaymentMethod'
import { useTranslation } from '@/hooks/useTranslation'
import { usePaymentMethodsStoreContext } from '@/state/PaymentMethodsStoreProvider/usePaymentMethodsStoreContext'

const Page = () => {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()

  const [activeMethod, setActiveMethod] = useState<PaymentMethod | null>(null)

  const [, setDefaultPaymentMethod] = useDefaultPaymentMethod()
  const { sections, isLoading, deletePaymentMethod } = usePaymentMethodsStoreContext()

  const { isModalVisible, openModal, closeModal, toggleModal } = useModal()

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleContextMenuPress = (method: PaymentMethod) => {
    bottomSheetRef.current?.present()
    setActiveMethod(method)
  }

  const handleActionSetDefault = () => {
    if (activeMethod) {
      setDefaultPaymentMethod(activeMethod)
    }
    bottomSheetRef.current?.close()
  }

  const handleActionDelete = () => {
    bottomSheetRef.current?.close()
    openModal()
  }

  const handleConfirmDelete = () => {
    if (activeMethod) {
      deletePaymentMethod(activeMethod)
    }
    closeModal()
  }

  if (isLoading) {
    return (
      <ScreenView title={t('PaymentMethods.title')}>
        <ScreenContent>
          <SkeletonPaymentMethod />
        </ScreenContent>
      </ScreenView>
    )
  }

  return (
    <ScreenView title={t('PaymentMethods.title')}>
      <ScreenContent>
        <SectionList
          estimatedItemSize={70}
          sections={sections}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={(section) =>
            section.data.length > 0 ? (
              <Typography variant="default-bold">{section.title}</Typography>
            ) : null
          }
          renderItem={({ item }) => (
            <PaymentMethodRow
              method={item}
              onContextMenuPress={() => handleContextMenuPress(item)}
            />
          )}
          ItemSeparatorComponent={() => <Divider className="h-1 bg-transparent" />}
          SectionSeparatorComponent={() => <Divider className="h-5 bg-transparent" />}
        />
      </ScreenContent>

      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        animateOnMount={!reducedMotion}
      >
        <BottomSheetContent>
          <PressableStyled onPress={handleActionSetDefault}>
            <ActionRow startIcon="check-circle" label={t('PaymentMethods.actions.saveAsDefault')} />
          </PressableStyled>

          {activeMethod?.type === 'card' ? (
            <PressableStyled onPress={handleActionDelete}>
              <ActionRow
                startIcon="delete"
                label={t('PaymentMethods.actions.removeCard')}
                variant="negative"
              />
            </PressableStyled>
          ) : null}
        </BottomSheetContent>
      </BottomSheetModal>

      <Modal visible={isModalVisible} onRequestClose={toggleModal}>
        <ModalContentWithActions
          variant="error"
          title={t('PaymentMethods.deleteConfirmModal.title')}
          text={t('PaymentMethods.deleteConfirmModal.message')}
          primaryActionLabel={t('PaymentMethods.deleteConfirmModal.actionConfirm')}
          primaryActionOnPress={handleConfirmDelete}
          secondaryActionLabel={t('PaymentMethods.deleteConfirmModal.actionReject')}
          secondaryActionOnPress={closeModal}
        />
      </Modal>
    </ScreenView>
  )
}

export default Page
