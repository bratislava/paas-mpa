import { useQuery } from '@tanstack/react-query'
import * as Application from 'expo-application'
import { useEffect, useState } from 'react'
import { Linking, Platform } from 'react-native'

import AvatarCircle from '@/components/info/AvatarCircle'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { environment } from '@/environment'
import { useTranslation } from '@/hooks/useTranslation'
import { mobileAppVersionOptions } from '@/modules/backend/constants/queryOptions'

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

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const goToStore = () => {
    if (Platform.OS === 'ios') {
      // TODO this link should be correct, but it does not work yet, probably due to App Store search indexing
      Linking.openURL('https://apps.apple.com/app/paas/id6457264414')
    } else {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.bratislava.paas')
    }
  }

  return (
    <Modal visible={showModal}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircle />}
        title={t('StoreVersionControl.title')}
        text={t('StoreVersionControl.text')}
        primaryActionLabel={t('StoreVersionControl.primaryActionLabel')}
        primaryActionOnPress={goToStore}
      />
    </Modal>
  )
}

export default StoreVersionControl
