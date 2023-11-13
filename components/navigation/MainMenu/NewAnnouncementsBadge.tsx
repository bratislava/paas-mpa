import React from 'react'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useLocale } from '@/hooks/useTranslation'
import { announcementsOptions } from '@/modules/backend/constants/queryOptions'
import { useLastReadAnnouncementIdStorage } from '@/modules/backend/hooks/useLastReadAnnouncementIdStorage'

const NewAnnouncementsBadge = () => {
  const locale = useLocale()

  const [lastReadAnnouncementId] = useLastReadAnnouncementIdStorage()
  const { data: announcementsData } = useQueryWithFocusRefetch(announcementsOptions(locale))
  const newAnnouncementsCount = lastReadAnnouncementId
    ? announcementsData?.announcements?.filter(
        (announcement) => announcement.id > lastReadAnnouncementId,
      ).length
    : announcementsData?.announcements.length

  if (!newAnnouncementsCount) {
    return null
  }

  return (
    <View className="h-6 w-6 items-center justify-center rounded-full bg-warning">
      <Typography variant="small" className="leading-6 text-white">
        {newAnnouncementsCount}
      </Typography>
    </View>
  )
}

export default NewAnnouncementsBadge
