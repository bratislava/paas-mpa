import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { useMutation } from '@tanstack/react-query'
import { deleteUser } from 'aws-amplify/auth'
import { useCallback, useRef } from 'react'
import { ScrollView } from 'react-native'

import LanguageSelectField from '@/components/controls/LanguageSelectField'
import NotificationSettings from '@/components/controls/notifications/NotificationSettings'
import ActionRow from '@/components/list-rows/ActionRow'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useModal } from '@/components/screen-layout/Modal/useModal'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { useSignOut } from '@/modules/cognito/hooks/useSignOut'

const SettingsPage = () => {
  const { t } = useTranslation()
  const signOut = useSignOut()

  const { isModalVisible, openModal, closeModal, toggleModal } = useModal()
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  /**
   * Delete user data on BE. If successful, delete user from Cognito.
   * Docs: https://docs.amplify.aws/react-native/build-a-backend/auth/delete-user-account/#allow-my-users-to-delete-their-account
   */
  const deleteUserMutation = useMutation({
    mutationFn: () => clientApi.usersControllerDeleteUser(),
    onSuccess: async (response) => {
      if (response.data) {
        await deleteUser()
        await signOut()
      }
    },
  })

  const handleContextMenuPress = () => {
    bottomSheetRef.current?.present()
  }

  const handleActionDelete = () => {
    bottomSheetRef.current?.close()
    openModal()
  }

  return (
    <ScreenView
      title={t('Settings.title')}
      options={{
        headerRight: () => (
          <IconButton
            name="more-horiz"
            accessibilityLabel={t('Settings.openContextMenu')}
            onPress={handleContextMenuPress}
          />
        ),
      }}
    >
      <ScreenContent className="flex-1">
        <ScrollView className="h-full" contentContainerStyle={{ gap: 20, flexGrow: 1 }}>
          <LanguageSelectField />

          <NotificationSettings />
        </ScrollView>
      </ScreenContent>

      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetContent className="min-h-[80px]">
          <PressableStyled onPress={handleActionDelete}>
            <ActionRow
              startIcon="delete"
              label={t('Settings.actions.deleteAccount')}
              variant="negative"
            />
          </PressableStyled>
        </BottomSheetContent>
      </BottomSheetModal>

      <Modal visible={isModalVisible} onRequestClose={toggleModal}>
        <ModalContentWithActions
          variant="error"
          isLoading={deleteUserMutation.isPending}
          title={t('Settings.deleteAccountConfirmModal.title')}
          text={t('Settings.deleteAccountConfirmModal.message')}
          primaryActionLabel={t('Settings.deleteAccountConfirmModal.actionConfirm')}
          primaryActionOnPress={deleteUserMutation.mutate}
          secondaryActionLabel={t('Settings.deleteAccountConfirmModal.actionReject')}
          secondaryActionOnPress={closeModal}
        />
      </Modal>
    </ScreenView>
  )
}

export default SettingsPage
