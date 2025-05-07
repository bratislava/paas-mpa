import BottomSheet from '@gorhom/bottom-sheet'
import { forwardRef, useRef } from 'react'
import { Platform, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { MapRef } from '@/components/map/Map'
import { MapZoneBottomSheetAddressLink } from '@/components/map/MapZoneBottomSheetAddressLink'
import MapZoneBottomSheetAttachment from '@/components/map/MapZoneBottomSheetAttachment'
import MapZoneBottomSheetPanel from '@/components/map/MapZoneBottomSheetPanel'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import Typography from '@/components/shared/Typography'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useTranslation } from '@/hooks/useTranslation'
import { MapUdrZone } from '@/modules/map/types'
import { cn } from '@/utils/cn'

type Props = {
  zone: MapUdrZone | null
  setFlyToCenter?: MapRef['setFlyToCenter']
  isZoomedOut?: boolean
  address?: string
}

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>(
  ({ zone: selectedZone, setFlyToCenter, isZoomedOut, address }, ref) => {
    const localRef = useRef<BottomSheet>(null)
    const refSetter = useMultipleRefsSetter(localRef, ref)

    const { t } = useTranslation()

    const animatedPosition = useSharedValue(0)

    return (
      <>
        <MapZoneBottomSheetAttachment {...{ animatedPosition, setFlyToCenter }} />
        <BottomSheet
          // Nested accessible is a problem with Maestro on iOS so we need to disable it on parent
          // https://maestro.mobile.dev/platform-support/react-native#interacting-with-nested-components-on-ios
          accessible={Platform.select({
            ios: false,
          })}
          key="mapZoneBottomSheet"
          ref={refSetter}
          keyboardBehavior="interactive"
          handleComponent={BottomSheetHandleWithShadow}
          animatedPosition={animatedPosition}
          enableDynamicSizing
          // This is a workaround for the issue with the bottom sheet that closes during height change,
          // GitHub Issue: https://github.com/bratislava/paas-mpa/issues/475
          // we hope that this might be the fix for the issue if not we will need to investigate further
          onClose={localRef.current?.expand}
        >
          <BottomSheetContent isDynamic className={cn('bg-white', selectedZone ? 'g-2' : 'g-3')}>
            {isZoomedOut ? (
              <View className="flex-col items-center">
                <Typography className="text-center">{t('ZoneBottomSheet.zoomIn')}</Typography>
              </View>
            ) : (
              <>
                <MapZoneBottomSheetAddressLink address={address} />

                <MapZoneBottomSheetPanel selectedZone={selectedZone} />
              </>
            )}
          </BottomSheetContent>
        </BottomSheet>
      </>
    )
  },
)

export default MapZoneBottomSheet
