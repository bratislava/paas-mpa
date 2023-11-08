import React, { ReactNode } from 'react'

import { EmptyStateAvatar } from '@/assets/avatars'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'

type Props = {
  contentTitle: string
  text?: string
  actionButton?: ReactNode
  actionButtonPosition?: 'insideContent' | 'bottom'
}

const EmptyStateScreen = ({
  contentTitle,
  text,
  actionButton,
  actionButtonPosition = 'bottom',
}: Props) => {
  return (
    <ScreenViewCentered
      actionButton={actionButtonPosition === 'bottom' && actionButton ? actionButton : undefined}
    >
      <ContentWithAvatar
        title={contentTitle}
        text={text}
        customAvatarComponent={<EmptyStateAvatar />}
        actionButton={
          actionButtonPosition === 'insideContent' && actionButton ? actionButton : undefined
        }
      />
    </ScreenViewCentered>
  )
}

export default EmptyStateScreen
