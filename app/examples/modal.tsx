import React, { useState } from 'react'

import Button from '@/components/shared/Button'
import Modal, { ModalContent, ModalContentWithActions } from '@/components/shared/Modal'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'

const ModalScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">Modal</Typography>
        <Button onPress={openModal}>Open modal</Button>
      </ScreenContent>

      <Modal
        visible={false}
        onRequestClose={() => {
          console.log('Modal has been closed.')
          setIsModalOpen(!isModalOpen)
        }}
      >
        <ModalContent>
          <Typography>Modal content</Typography>
          <Button onPress={closeModal}>Close modal</Button>
        </ModalContent>
      </Modal>

      <Modal visible={isModalOpen} onRequestClose={() => setIsModalOpen(!isModalOpen)}>
        <ModalContentWithActions
          variant="success"
          title="Confirm modal"
          text="Optional text"
          primaryActionLabel="Some action"
          primaryActionOnPress={() => console.log('Primary action pressed')}
          secondaryActionLabel="Close"
          secondaryActionOnPress={closeModal}
        />
      </Modal>
    </ScreenView>
  )
}

export default ModalScreen
