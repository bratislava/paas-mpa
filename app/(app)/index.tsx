import { PortalHost } from '@gorhom/portal'
import { router } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MapScreen from '@/components/map/MapScreen'
import IconButton from '@/components/shared/IconButton'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { announcementsOptions } from '@/modules/backend/constants/queryOptions'
import { useLastReadAnnouncementIdStorage } from '@/modules/backend/hooks/useLastReadAnnouncementIdStorage'

const IndexScreen = () => {
  const t = useTranslation()
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

  return (
    <View className="flex-1">
      <MapScreen />

      <View className="absolute right-0 px-2.5 g-3" style={{ top }}>
        <View>
          <IconButton
            name="more-vert"
            accessibilityLabel={t('Navigation.openMenu')}
            variant="white-raised-small"
            onPress={handlePressOpen}
            // onLongPress={()=> router.push('/dev')}
          />
          {newAnnouncementsCount ? (
            <View
              className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-warning"
              pointerEvents="box-none"
            />
          ) : null}
        </View>
      </View>

      <PortalHost name="index" />
    </View>
  )
}

export default IndexScreen
