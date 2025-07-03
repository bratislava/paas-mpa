import { useQueryClient } from '@tanstack/react-query'
import { router, useFocusEffect } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MapScreen from '@/components/map/MapScreen'
import IconButton from '@/components/shared/IconButton'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import {
  activeTicketsOptions,
  announcementsOptions,
} from '@/modules/backend/constants/queryOptions'
import { useLastReadAnnouncementIdStorage } from '@/modules/backend/hooks/useLastReadAnnouncementIdStorage'

const IndexScreen = () => {
  const { t } = useTranslation()
  const locale = useLocale()
  const { top } = useSafeAreaInsets()

  // TODO deduplicate (used also in `NewAnnouncementsBadge`)
  const [lastReadAnnouncementId] = useLastReadAnnouncementIdStorage()
  const { data: announcementsData } = useQueryWithFocusRefetch(announcementsOptions(locale))
  const newAnnouncementsCount = lastReadAnnouncementId
    ? announcementsData?.announcements?.filter(
        (announcement) => announcement.id > lastReadAnnouncementId,
      ).length
    : announcementsData?.announcements.length

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handlePressOpen = () => {
    router.push('/menu')
  }

  // Invalidate active tickets query on map focus to have fresh data when returning to the map
  const queryClient = useQueryClient()
  useFocusEffect(() => {
    if (queryClient.getQueryState(activeTicketsOptions().queryKey)?.status === 'success') {
      queryClient.invalidateQueries({ queryKey: activeTicketsOptions().queryKey })
    }
  })

  return (
    <View className="flex-1">
      <MapScreen />

      <StatusBar translucent backgroundColor="transparent" />

      <View className="absolute right-0 px-2.5 g-3" style={{ top }}>
        <View>
          <IconButton
            name="more-vert"
            accessibilityLabel={t('Navigation.openMenu')}
            variant="white-raised-small"
            onPress={handlePressOpen}
          />

          {newAnnouncementsCount ? (
            <View
              className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-warning"
              pointerEvents="box-none"
            />
          ) : null}
        </View>
      </View>
    </View>
  )
}

export default IndexScreen
