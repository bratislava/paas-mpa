import { View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import { AnnouncementType } from '@/modules/backend/openapi-generated'
import { cn } from '@/utils/cn'

type Props = {
  variant: AnnouncementType
}

const SeveritySquare = ({ variant }: Props) => {
  const iconName: IconName =
    (
      {
        [AnnouncementType.Info]: 'info',
        [AnnouncementType.Warn]: 'warning',
        [AnnouncementType.Error]: 'error',
      } as const
    )[variant] ?? 'info'

  return (
    <View
      className={cn('flex items-center justify-center rounded-lg p-3.5', {
        'bg-green-light': variant === AnnouncementType.Info,
        'bg-warning-light': variant === AnnouncementType.Warn,
        'bg-negative-light': variant === AnnouncementType.Error,
      })}
    >
      <Icon
        name={iconName}
        className={cn({
          'text-green': variant === AnnouncementType.Info,
          'text-warning': variant === AnnouncementType.Warn,
          'text-negative': variant === AnnouncementType.Error,
        })}
        size={20}
      />
    </View>
  )
}

export default SeveritySquare
