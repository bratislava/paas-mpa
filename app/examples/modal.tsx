import React from 'react'

import Button from '@/components/shared/Button'
import Modal, { ModalContent, ModalContentWithActions } from '@/components/shared/Modal'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useModal } from '@/hooks/useModal'

const ModalScreen = () => {
  const { isModalVisible, openModal, closeModal, toggleModal } = useModal()

  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">Modal</Typography>
        <Button onPress={openModal}>Open modal</Button>
      </ScreenContent>

      <Modal visible={false} onRequestClose={toggleModal}>
        <ModalContent>
          <Typography>Modal content</Typography>
          <Button onPress={closeModal}>Close modal</Button>
        </ModalContent>
      </Modal>

      <Modal visible={isModalVisible} onRequestClose={toggleModal}>
        <ModalContentWithActions
          variant="success"
          title="Confirm modal"
          text="Optional text"
          primaryActionLabel="Some action"
          // eslint-disable-next-line no-console
          primaryActionOnPress={() => console.log('Primary action pressed')}
          secondaryActionLabel="Close"
          secondaryActionOnPress={closeModal}
        />
      </Modal>
    </ScreenView>
  )
}

export default ModalScreen
