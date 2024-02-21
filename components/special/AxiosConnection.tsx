import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import AvatarCircleNetworkOff from '@/components/info/AvatarCircleNetworkOff'
import Modal from '@/components/screen-layout/Modal/Modal'
import ModalContentWithActions from '@/components/screen-layout/Modal/ModalContentWithActions'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { useAxiosResponseInterceptors } from '@/modules/backend/hooks/useAxiosResponseInterceptors'

const AxiosConnection = () => {
  const t = useTranslation('AxiosConnection')

  const [serverConnectionError, setServerConnectionError] = useState(false)
  useAxiosResponseInterceptors(setServerConnectionError)

  const healthCheck = useMutation({
    mutationFn: () => {
      return clientApi.appControllerHealth()
    },
    onSuccess: () => setServerConnectionError(false),
    onError: () => setServerConnectionError(true),
  })

  useEffect(() => {
    healthCheck.mutate()
    // needs to be done only once (the first time the component is mounted)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal visible={serverConnectionError}>
      <ModalContentWithActions
        customAvatarComponent={<AvatarCircleNetworkOff />}
        title={t('title')}
        isLoading={healthCheck.isPending}
        text={t('text')}
        primaryActionLabel={t('primaryActionLabel')}
        primaryActionOnPress={healthCheck.mutate}
      />
    </Modal>
  )
}

export default AxiosConnection
