import { ReactNode } from 'react'

import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import { ScreenViewProps } from '@/components/screen-layout/ScreenView'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  contentTitle?: string
  text?: string
  actionButton?: ReactNode
} & Omit<ScreenViewProps, 'children'>

/**
 * Error screen with error message and title
 */
const ErrorScreen = ({ text, actionButton, contentTitle, ...rest }: Props) => {
  const t = useTranslation('ErrorScreen')

  return (
    <ScreenViewCentered options={{ headerTransparent: true }} {...rest}>
      <ContentWithAvatar
        actionButton={actionButton}
        variant="error"
        title={contentTitle ?? t('title')}
        text={text ?? t('text')}
      />
    </ScreenViewCentered>
  )
}

export default ErrorScreen
