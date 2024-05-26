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
  const { t } = useTranslation()

  return (
    <ScreenViewCentered options={{ headerTransparent: true }} {...rest}>
      <ContentWithAvatar
        actionButton={actionButton}
        variant="error"
        title={contentTitle ?? t('ErrorScreen.title')}
        text={text ?? t('ErrorScreen.text')}
      />
    </ScreenViewCentered>
  )
}

export default ErrorScreen
