import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useMutation } from '@tanstack/react-query'
import { deleteUser } from 'aws-amplify/auth'
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
import { clientApi } from '@/modules/backend/client-api'
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
    bottomSheetRef.current?.expand()
  }

  const handleActionDelete = () => {
    bottomSheetRef.current?.close()
    openModal()
  }

  return (
    <ScreenView title={t('title')} hasBackButton>
      <Stack.Screen
        options={{
          headerRight: () => (
            <IconButton
              name="more-horiz"
              accessibilityLabel={t('openVehicleContextMenu')}
              onPress={handleContextMenuPress}
            />
          ),
        }}
      />

      <ScreenContent className="flex-1">
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
          isLoading={deleteUserMutation.isPending}
          title={t('deleteAccountConfirmModal.title')}
          text={t('deleteAccountConfirmModal.message')}
          primaryActionLabel={t('deleteAccountConfirmModal.actionConfirm')}
          primaryActionOnPress={deleteUserMutation.mutate}
          secondaryActionLabel={t('deleteAccountConfirmModal.actionReject')}
          secondaryActionOnPress={closeModal}
        />
      </Modal>
    </ScreenView>
  )
}

export default SettingsPage
