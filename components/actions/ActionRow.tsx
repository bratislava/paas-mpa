import { Pressable, PressableProps, View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

const ActionRow = ({
  icon,
  label,
  variant = 'default',
  ...rest
}: { icon: IconName; label: string; variant?: 'default' | 'negative' } & Omit<
  PressableProps,
  'children'
>) => {
  const textColor = variant === 'negative' ? 'text-negative' : ''

  return (
    <Pressable className="py-4" {...rest}>
      <View className="flex-row gap-3">
        <Icon name={icon} className={textColor} />
        <Typography variant="default-semibold" className={textColor}>
          {label}
        </Typography>
      </View>
    </Pressable>
  )
}

export default ActionRow
