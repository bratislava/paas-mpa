import clsx from 'clsx'
import * as Location from 'expo-location'
import { Link } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import { MapRef } from '@/components/map/Map'
import BottomSheetTopAttachment, {
  BottomSheetTopAttachmentProps,
} from '@/components/screen-layout/BottomSheet/BottomSheetTopAttachment'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { ticketsOptions } from '@/modules/backend/constants/queryOptions'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'

type Props = Omit<BottomSheetTopAttachmentProps, 'children'> & {
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const MapZoneBottomSheetAttachment = ({ setFlyToCenter, ...restProps }: Props) => {
  const t = useTranslation('ZoneBottomSheet.TopAttachment')
  const [permissionStatus] = useLocationPermission()
  const onLocationPress = useCallback(async () => {
    if (permissionStatus === Location.PermissionStatus.GRANTED) {
      let location = await Location.getLastKnownPositionAsync()
      if (!location) {
        location = await Location.getCurrentPositionAsync()
      }
      setFlyToCenter?.([location.coords.longitude, location.coords.latitude])
    }
  }, [setFlyToCenter, permissionStatus])

  const now = useMemo(() => new Date().toISOString(), [])
  const { data: ticketsData } = useQueryWithFocusRefetch(
    ticketsOptions({
      parkingEndFrom: now,
    }),
  )
  const activeTicketsCount = ticketsData?.tickets.length ?? 0

  return (
    <BottomSheetTopAttachment {...restProps}>
      <FlexRow
        className={clsx('flex-1 items-end p-2.5 pt-0', activeTicketsCount === 0 && 'justify-end')}
      >
        {activeTicketsCount > 0 ? (
          <View className="rounded-full bg-white shadow ">
            <Link asChild href="/tickets">
              <PressableStyled>
                <FlexRow className="items-center p-2 pr-3 g-2">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-light">
                    <Icon size={20} name="local-parking" />
                  </View>
                  <Typography variant="default-bold" className="leading-6">
                    {t('tickets', { count: activeTicketsCount })}
                  </Typography>
                </FlexRow>
              </PressableStyled>
            </Link>
          </View>
        ) : null}

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
