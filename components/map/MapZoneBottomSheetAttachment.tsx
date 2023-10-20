import * as Location from 'expo-location'
import { Link } from 'expo-router'
import { useCallback } from 'react'
import { View } from 'react-native'

import { MapRef } from '@/components/map/Map'
import BottomSheetTopAttachment, {
  BottomSheetTopAttachmentProps,
} from '@/components/shared/BottomSheetTopAttachment'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'

type Props = Omit<BottomSheetTopAttachmentProps, 'children'> & {
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const MapZoneBottomSheetAttachment = ({ setFlyToCenter, ...restProps }: Props) => {
  const { permissionStatus } = useLocationPermission()
  const onLocationPress = useCallback(async () => {
    if (permissionStatus === Location.PermissionStatus.GRANTED) {
      let location = await Location.getLastKnownPositionAsync()
      if (!location) {
        location = await Location.getCurrentPositionAsync()
      }
      setFlyToCenter?.([location.coords.longitude, location.coords.latitude])
    }
  }, [setFlyToCenter, permissionStatus])

  return (
    <BottomSheetTopAttachment {...restProps}>
      <FlexRow cn="flex-1 p-[10px] pt-0 items-end">
        <View className="rounded-full bg-white shadow ">
          <Link asChild href="/tickets">
            <PressableStyled>
              <FlexRow cn="g-2 p-2 pr-3 items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-light">
                  <Icon size={20} name="local-parking" />
                </View>
                <Typography variant="default-bold" className="py-1">
                  Tickets (2)
                </Typography>
              </FlexRow>
            </PressableStyled>
          </Link>
        </View>

        <IconButton
          name="gps-fixed"
          // TODO translation
          accessibilityLabel="Go to user location"
          variant="white-raised"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onPress={onLocationPress}
        />
      </FlexRow>
    </BottomSheetTopAttachment>
  )
}

export default MapZoneBottomSheetAttachment
