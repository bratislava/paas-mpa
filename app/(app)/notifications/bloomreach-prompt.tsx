import { router } from 'expo-router'
import { useEffect } from 'react'

import { useBloomreachNotificationModalStorage } from '@/hooks/storage/useBloomreachNotificationModalStorage'

const BloomreachPromptTrigger = () => {
  const { forceShow } = useBloomreachNotificationModalStorage()
  useEffect(() => {
    forceShow()
    router.replace('/')
  }, [forceShow])

  return null
}

export default BloomreachPromptTrigger
