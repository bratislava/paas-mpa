import { useQuery } from '@tanstack/react-query'
import * as Application from 'expo-application'
import { useEffect, useState } from 'react'

import AvatarCircle from '@/components/info/AvatarCircle'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { environment } from '@/environment'
import { useTranslation } from '@/hooks/useTranslation'
import { mobileAppVersionOptions } from '@/modules/backend/constants/queryOptions'
import { navigateToStore } from '@/utils/navigateToStore'

const StoreVersionControl = () => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  const appVersionQuery = useQuery(mobileAppVersionOptions())

  useEffect(() => {
    if (
      environment.deployment === 'production' &&
      appVersionQuery.data &&
      Application.nativeApplicationVersion &&
      appVersionQuery.data.localeCompare(Application.nativeApplicationVersion, undefined, {
        numeric: true,
        sensitivity: 'base',
      }) === 1
    ) {
      setShowModal(true)
    }
  }, [appVersionQuery.data])

  return (
    <Modal visible={showModal}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircle />}
        title={t('StoreVersionControl.title')}
        text={t('StoreVersionControl.text')}
        primaryActionLabel={t('StoreVersionControl.primaryActionLabel')}
        primaryActionOnPress={navigateToStore}
      />
    </Modal>
  )
}

export default StoreVersionControl
