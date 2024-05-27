import NetInfo from '@react-native-community/netinfo'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import AvatarCircleNetworkOff from '@/components/info/AvatarCircleNetworkOff'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { useAxiosResponseInterceptors } from '@/modules/backend/hooks/useAxiosResponseInterceptors'

const NoConnectionModal = () => {
  const { t } = useTranslation()

  const [isConnected, setIsConnected] = useState(true)
  const [serverConnectionError, setServerConnectionError] = useState(false)
  useAxiosResponseInterceptors(setServerConnectionError)

  const healthCheck = useMutation({
    mutationFn: () => {
      return clientApi.appControllerHealth()
    },
    onSuccess: () => {
      setIsConnected(true)
      setServerConnectionError(false)
    },
    onError: () => setServerConnectionError(true),
  })

  useEffect(() => {
    healthCheck.mutate()

    const unsubscribe = NetInfo.addEventListener((networkState) => {
      if (!networkState.isInternetReachable) {
        setIsConnected(false)
      }
    })

    return () => {
      unsubscribe()
    }
    // needs to be done only once (the first time the component is mounted)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const modalTitle = isConnected ? t('NoConnection.server.title') : t('NoConnection.network.title')
  const modalText = isConnected ? t('NoConnection.server.text') : t('NoConnection.network.text')

  return (
    <Modal visible={serverConnectionError}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircleNetworkOff />}
        title={modalTitle}
        isLoading={healthCheck.isPending}
        text={modalText}
        primaryActionLabel={t('NoConnection.primaryActionLabel')}
        primaryActionOnPress={healthCheck.mutate}
      />
    </Modal>
  )
}

export default NoConnectionModal
