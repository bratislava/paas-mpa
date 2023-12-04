import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { Link, Stack } from 'expo-router'
import { useCallback, useRef } from 'react'
import { ScrollView } from 'react-native'

import LanguageSelect from '@/components/controls/LanguageSelect'
import NotificationSettings from '@/components/controls/notifications/NotificationSettings'
import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useModal } from '@/components/screen-layout/Modal/useModal'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation as useTranslationLocal } from '@/hooks/useTranslation'
import { useSignOut } from '@/modules/cognito/hooks/useSignOut'

const SettingsPage = () => {
  const t = useTranslationLocal('Settings')
  const signOut = useSignOut()

  const { isModalVisible, openModal, closeModal, toggleModal } = useModal()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handleContextMenuPress = () => {
    bottomSheetRef.current?.expand()
  }

  const handleActionDelete = () => {
    bottomSheetRef.current?.close()
    openModal()
  }

  const handleConfirmDelete = () => {
    signOut()
  }

  return (
    <ScreenView>
      <Stack.Screen
        options={{
          title: t('title'),
          headerRight: () => (
            <IconButton
              name="more-vert"
              accessibilityLabel={t('openVehicleContextMenu')}
              onPress={handleContextMenuPress}
            />
          ),
        }}
      />

      <ScreenContent className="flex-1">
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <ScrollView className="h-full" contentContainerStyle={{ gap: 20, flexGrow: 1 }}>
          <Field label={t('language')}>
            <Link asChild href="/settings/language">
              <PressableStyled>
                <LanguageSelect />
              </PressableStyled>
            </Link>
          </Field>

          <NotificationSettings />
        </ScrollView>
      </ScreenContent>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetContent>
          <PressableStyled onPress={handleActionDelete}>
            <ActionRow startIcon="delete" label={t('actions.deleteAccount')} variant="negative" />
          </PressableStyled>
        </BottomSheetContent>
      </BottomSheet>

      <Modal visible={isModalVisible} onRequestClose={toggleModal}>
        <ModalContentWithActions
          variant="error"
          title={t('deleteAccountConfirmModal.title')}
          text={t('deleteAccountConfirmModal.message')}
          primaryActionLabel={t('deleteAccountConfirmModal.actionConfirm')}
          primaryActionOnPress={handleConfirmDelete}
          secondaryActionLabel={t('deleteAccountConfirmModal.actionReject')}
          secondaryActionOnPress={closeModal}
        />
      </Modal>
    </ScreenView>
  )
}

export default SettingsPage
