import React from 'react'
import { Modal as ModalRN, ModalProps } from 'react-native'

import ModalBackdrop from '@/components/screen-layout/Modal/ModalBackdrop'
import ModalContainer from '@/components/screen-layout/Modal/ModalContainer'

const Modal = ({ children, ...props }: ModalProps) => {
  return (
    <ModalRN transparent animationType="fade" {...props}>
      <ModalBackdrop>
        <ModalContainer onRequestClose={props.onRequestClose}>{children}</ModalContainer>
      </ModalBackdrop>
    </ModalRN>
  )
}

export default Modal
