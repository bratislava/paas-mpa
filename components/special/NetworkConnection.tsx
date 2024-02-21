import NetInfo from '@react-native-community/netinfo'
import { useEffect, useState } from 'react'

import AvatarCircleNetworkOff from '@/components/info/AvatarCircleNetworkOff'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useTranslation } from '@/hooks/useTranslation'

const NetworkConnection = () => {
  const t = useTranslation('NoNetworkConnection')

  const [isConnected, setIsConnected] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((networkState) => {
      setIsConnected(!!networkState.isConnected)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const onRefresh = async () => {
    setIsLoading(true)

    const state = await NetInfo.fetch()
    setIsConnected(!!state.isConnected)

    setIsLoading(false)
  }

  return (
    <Modal visible={!isConnected}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircleNetworkOff />}
        title={t('title')}
        isLoading={isLoading}
        text={t('text')}
        primaryActionLabel={t('primaryActionLabel')}
        primaryActionOnPress={onRefresh}
      />
    </Modal>
  )
}

export default NetworkConnection
