import clsx from 'clsx'
import { forwardRef } from 'react'
import { Pressable, PressableProps, View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

type PressablePropsOmitted = Omit<PressableProps, 'children'>

type Props = {
  children: string
  disabled?: boolean
  startIcon?: IconName
} & PressablePropsOmitted

const FloatingButton = forwardRef<View, Props>(
  ({ disabled, children, startIcon, ...rest }, ref) => {
    const buttonContainerClassNames = clsx(
      'flex flex-row items-center justify-center rounded-full bg-dark px-4 py-2 g-2 active:opacity-70',
      {
        'opacity-50': disabled,
      },
    )

    return (
      <Pressable ref={ref} hitSlop={4} {...rest} className={clsx(buttonContainerClassNames)}>
        {startIcon ? <Icon name={startIcon} className="text-white" /> : null}
        <Typography variant="button" className="text-white">
          {children}
        </Typography>
      </Pressable>
    )
  },
)

export default FloatingButton
