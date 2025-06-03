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
import { cn } from '@/utils/cn'

/** Time after pressing the button when it cannot be pressed again */
const LOCATION_REQUEST_THROTTLE = 500 // ms
const LOCATION_REQUEST_TIMEOUT = 500 // ms

type Props = Omit<BottomSheetTopAttachmentProps, 'children'> & {
  flyTo?: MapRef['flyTo']
}

const MapZoneBottomSheetAttachment = ({ flyTo, ...restProps }: Props) => {
  const { t } = useTranslation()
  const { locationPermissionStatus } = useLocationPermission()
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isButtonDisabledTimeout, setIsButtonDisabledTimeout] = useState<NodeJS.Timeout | null>(
    null,
  )
  const [requestTimeout, setRequestTimeout] = useState<NodeJS.Timeout | null>(null)

  const onLocationPress = useCallback(async () => {
    if (locationPermissionStatus !== Location.PermissionStatus.DENIED) {
      setIsButtonDisabled(true)
      try {
        const location = await Promise.race<Location.LocationObject | null>([
          Location.getLastKnownPositionAsync(),
          new Promise((resolve) => {
            setRequestTimeout(setTimeout(() => resolve(null), LOCATION_REQUEST_TIMEOUT))
          }),
        ])
        if (location) {
          flyTo?.([location.coords.longitude, location.coords.latitude])
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
  }, [flyTo, locationPermissionStatus])

  const { data: ticketsData, refetch } = useQueryWithFocusRefetch(activeTicketsOptions())

  useQueryInvalidateOnTicketExpire(ticketsData?.tickets ?? null, refetch, ['Tickets'])

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
        // This allows the user to slide on the map through transparent spaces in this component
        pointerEvents="box-none"
        className={cn('flex-1 items-end p-2.5 pt-0', activeTicketsCount === 0 && 'justify-end')}
      >
        {activeTicketsCount > 0 ? (
          <View className="rounded-full bg-white shadow">
            <Link asChild href="/tickets">
              <PressableStyled testID="activeTicketsCount">
                <FlexRow className="items-center p-2 pr-3 g-2">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-light">
                    <Icon size={20} name="local-parking" />
                  </View>
                  <Typography variant="default-bold" className="leading-6">
                    {t('ZoneBottomSheet.TopAttachment.tickets', {
                      numberOfTickets: activeTicketsCount,
                    })}
                  </Typography>
                </FlexRow>
              </PressableStyled>
            </Link>
          </View>
        ) : null}

        <View>
          <IconButton
            name="gps-fixed"
            accessibilityLabel={t('ZoneBottomSheet.TopAttachment.goToUserLocation')}
            variant="white-raised"
            onPress={onLocationPress}
            disabled={
              isButtonDisabled || locationPermissionStatus === Location.PermissionStatus.DENIED
            }
          />
        </View>
      </FlexRow>
    </BottomSheetTopAttachment>
  )
}

export default MapZoneBottomSheetAttachment
