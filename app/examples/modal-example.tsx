import React from 'react'

import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContent from '@/components/screen-layout/Modal/ModalContent'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useModal } from '@/components/screen-layout/Modal/useModal'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'

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
