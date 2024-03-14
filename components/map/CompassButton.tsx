import { forwardRef, useCallback } from 'react'
import { Pressable, View } from 'react-native'

import { CompassIcon } from '@/assets/map'
import { useTranslation } from '@/hooks/useTranslation'
import { useMapStoreContext } from '@/state/MapStoreProvider/useMapStoreContext'
import { cn } from '@/utils/cn'

type Props = {
  heading: number
}

const CompassButton = forwardRef<View, Props>(({ heading }, ref) => {
  const t = useTranslation('MapScreen')
  const { rotateToNorth } = useMapStoreContext()

  const handlePress = useCallback(() => {
    rotateToNorth?.()
  }, [rotateToNorth])

  if (heading === 0) {
    return null
  }

  return (
    <Pressable
      ref={ref}
      hitSlop={12}
      accessibilityLabel={t('compass')}
      className={cn('self-start rounded-full bg-white shadow')}
      onPress={handlePress}
    >
      {({ pressed }) => (
        <CompassIcon
          width={44}
          height={44}
          style={{ transform: [{ rotate: `-${heading}deg` }] }}
          className={cn('text-dark', pressed && 'text-dark/50')}
        />
      )}
    </Pressable>
  )
})

export default CompassButton
