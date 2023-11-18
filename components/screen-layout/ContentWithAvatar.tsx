import clsx from 'clsx'
import { ReactNode } from 'react'
import { View, ViewProps } from 'react-native'

import AvatarCircle from '@/components/info/AvatarCircle'
import Markdown from '@/components/shared/Markdown'
import Typography from '@/components/shared/Typography'

type ContentWithAvatarProps = {
  title: string
  text?: string
  variant?: 'success' | 'error'
  customAvatarComponent?: ReactNode
  actionButton?: ReactNode
  markdown?: boolean
} & ViewProps

const ContentWithAvatar = ({
  title,
  text,
  className,
  children,
  variant,
  customAvatarComponent,
  actionButton,
  markdown,
  ...rest
}: ContentWithAvatarProps) => {
  return (
    <View {...rest} className={clsx('w-full bg-white px-5 py-8 g-6', className)}>
      <View className="items-center">
        {customAvatarComponent ?? <AvatarCircle variant={variant} />}
      </View>
      <View className="g-2">
        <Typography variant="h1" className="text-center">
          {title}
        </Typography>
        {text ? (
          markdown ? (
            <Markdown textCenter>{text}</Markdown>
          ) : (
            <Typography className="text-center">{text}</Typography>
          )
        ) : null}
      </View>
      {children}

      {actionButton}
    </View>
  )
}

export default ContentWithAvatar
