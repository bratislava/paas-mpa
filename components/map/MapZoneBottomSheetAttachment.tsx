import * as Location from 'expo-location'
import { Link } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
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
import { useQueryInvalidateOnTicketExpire } from '@/hooks/useQueryInvalidateOnTicketExpire'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { activeTicketsOptions } from '@/modules/backend/constants/queryOptions'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'
import { clsx } from '@/utils/clsx'

/** Time after pressing the button when it cannot be pressed again */
const LOCATION_REQUEST_THROTTLE = 500 // ms
const LOCATION_REQUEST_TIMEOUT = 500 // ms

type Props = Omit<BottomSheetTopAttachmentProps, 'children'> & {
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const MapZoneBottomSheetAttachment = ({ setFlyToCenter, ...restProps }: Props) => {
  const t = useTranslation('ZoneBottomSheet.TopAttachment')
  const [permissionStatus] = useLocationPermission()
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isButtonDisabledTimeout, setIsButtonDisabledTimeout] = useState<NodeJS.Timeout | null>(
    null,
  )
  const [requestTimeout, setRequestTimeout] = useState<NodeJS.Timeout | null>(null)

  const onLocationPress = useCallback(async () => {
    if (permissionStatus !== Location.PermissionStatus.DENIED) {
      setIsButtonDisabled(true)
      try {
        const location = await Promise.race<Location.LocationObject | null>([
          Location.getLastKnownPositionAsync(),
          new Promise((resolve) => {
            setRequestTimeout(setTimeout(() => resolve(null), LOCATION_REQUEST_TIMEOUT))
          }),
        ])
        if (location) {
          setFlyToCenter?.([location.coords.longitude, location.coords.latitude])
        }
        setIsButtonDisabledTimeout(
          setTimeout(() => {
            setIsButtonDisabled(false)
            setIsButtonDisabledTimeout(null)
          }, LOCATION_REQUEST_THROTTLE),
        )
      } catch (error) {
        setIsButtonDisabled(false)
      }
    }
  }, [setFlyToCenter, permissionStatus])

  const { data: ticketsData, refetch } = useQueryWithFocusRefetch(activeTicketsOptions())
  console.log('ticketsData')

  useQueryInvalidateOnTicketExpire(
    ticketsData?.tickets ?? null,
    refetch,
    activeTicketsOptions().queryKey,
  )

  useEffect(() => {
    return () => {
      if (isButtonDisabledTimeout) {
        clearTimeout(isButtonDisabledTimeout)
      }
    }
  }, [isButtonDisabledTimeout])

  useEffect(() => {
    return () => {
      if (requestTimeout) {
        clearTimeout(requestTimeout)
      }
    }
  }, [requestTimeout])

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

        <View>
          <IconButton
            name="gps-fixed"
            accessibilityLabel={t('goToUserLocation')}
            variant="white-raised"
            onPress={onLocationPress}
            disabled={isButtonDisabled || permissionStatus === Location.PermissionStatus.DENIED}
          />
        </View>
      </FlexRow>
    </BottomSheetTopAttachment>
  )
}

export default MapZoneBottomSheetAttachment
