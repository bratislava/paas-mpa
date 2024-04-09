import { ReactNode } from 'react'

import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import { ScreenViewProps } from '@/components/screen-layout/ScreenView'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  title?: string
  text?: string
  actionButton?: ReactNode
} & Omit<ScreenViewProps, 'children'>

/**
 * Error screen with error message and title
 */
const ErrorScreen = ({ title, text, actionButton, ...rest }: Props) => {
  const t = useTranslation('ErrorScreen')

  return (
    <ScreenViewCentered options={{ headerTransparent: true }} title="" {...rest}>
      <ContentWithAvatar
        actionButton={actionButton}
        variant="error"
        title={title ?? t('title')}
        text={text ?? t('text')}
      />
    </ScreenViewCentered>
  )
}

export default ErrorScreen
