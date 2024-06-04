import { ActivityIndicator } from 'react-native'

import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import { useTranslation } from '@/hooks/useTranslation'

const PendingContent = () => {
  const { t } = useTranslation()

  return (
    <ContentWithAvatar
      title={t('PurchaseScreen.pendingTitle')}
      text={t('PurchaseScreen.pendingText')}
    >
      <ActivityIndicator size="large" />
    </ContentWithAvatar>
  )
}

export default PendingContent
