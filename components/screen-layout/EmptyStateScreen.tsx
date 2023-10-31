import React, { ReactNode } from 'react'

import { EmptyStateAvatar } from '@/assets/avatars'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'

type Props = {
  title: string
  text?: string
  button?: ReactNode
  buttonPosition?: 'insideContent' | 'bottom'
}

const EmptyStateScreen = ({ title, text, button, buttonPosition = 'bottom' }: Props) => {
  return (
    <ScreenViewCentered actionButton={buttonPosition === 'bottom' && button ? button : undefined}>
      <ContentWithAvatar
        title={title}
        text={text}
        customAvatarComponent={<EmptyStateAvatar />}
        actionButton={buttonPosition === 'insideContent' && button ? button : undefined}
      />
    </ScreenViewCentered>
  )
}

export default EmptyStateScreen
