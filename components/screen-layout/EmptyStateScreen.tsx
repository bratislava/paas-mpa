import React, { ReactNode } from 'react'

import { EmptyStateAvatar } from '@/assets/avatars'
import CenteredScreenView from '@/components/screen-layout/CenteredScreenView'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'

type Props = {
  title: string
  text?: string
  button?: ReactNode
  buttonPosition?: 'insideContent' | 'bottom'
}

const EmptyStateScreen = ({ title, text, button, buttonPosition = 'bottom' }: Props) => {
  return (
    <CenteredScreenView actionButton={buttonPosition === 'bottom' && button ? button : undefined}>
      <ContentWithAvatar
        title={title}
        text={text}
        customAvatarComponent={<EmptyStateAvatar />}
        actionButton={buttonPosition === 'insideContent' && button ? button : undefined}
      />
    </CenteredScreenView>
  )
}

export default EmptyStateScreen
