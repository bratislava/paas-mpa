import clsx from 'clsx'
import { forwardRef, useCallback } from 'react'
import { Pressable, View } from 'react-native'

import { CompassIcon } from '@/assets/map'
import { useTranslation } from '@/hooks/useTranslation'
import { useMapSearchContext } from '@/state/MapSearchProvider/useMapSearchContext'

type Props = {
  heading: number
}

const CompassButton = forwardRef<View, Props>(({ heading }, ref) => {
  const t = useTranslation('MapScreen')
  const { rotateToNorth } = useMapSearchContext()

  const handlePress = useCallback(() => {
    rotateToNorth?.()
  }, [rotateToNorth])

  return (
    <Pressable
      ref={ref}
      hitSlop={12}
      accessibilityLabel={t('compass')}
      className={clsx('self-start rounded-full bg-white shadow')}
      onPress={handlePress}
    >
      {({ pressed }) => (
        <CompassIcon
          width={48}
          height={48}
          style={{ transform: [{ rotate: `${heading}deg` }] }}
          className={clsx('text-dark', pressed && 'text-dark/50')}
        />
      )}
    </Pressable>
  )
})

export default CompassButton
