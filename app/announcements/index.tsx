import { useCallback, useEffect, useRef } from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import Announcement from '@/components/info/Announcement'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { announcementsOptions } from '@/modules/backend/constants/queryOptions'
import { useLastReadAnnouncementIdStorage } from '@/modules/backend/hooks/useLastReadAnnouncementIdStorage'
import { AnnouncementDto } from '@/modules/backend/openapi-generated'

const AnnouncementsScreen = () => {
  const t = useTranslation('Announcements')

  const { data, isPending, isError, error } = useQueryWithFocusRefetch(announcementsOptions())

  const [lastReadAnnouncementId, setLastReadAnnouncementId] = useLastReadAnnouncementIdStorage()

  const resaveLastReadAnnouncementId = useRef(() => {
    if (data?.announcements && data.announcements.length > 0) {
      const newestAnnouncement = data.announcements[0]
      if (!lastReadAnnouncementId || newestAnnouncement.id > lastReadAnnouncementId) {
        setLastReadAnnouncementId(newestAnnouncement.id)
      }
    }
  })

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      resaveLastReadAnnouncementId.current()
    }
  }, [])

  const renderItem: ListRenderItem<AnnouncementDto> = useCallback(
    ({ item }) => {
      return (
        <Announcement
          announcement={item}
          isNew={!lastReadAnnouncementId || item.id > lastReadAnnouncementId}
        />
      )
    },
    [lastReadAnnouncementId],
  )

  if (isPending) {
    return <Typography>Loading...</Typography>
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  if (data.announcements.length === 0) {
    return <EmptyStateScreen title={t('noAnnouncementsTitle')} />
  }

  return (
    <ScreenView title={t('title')}>
      <FlatList data={data.announcements} renderItem={renderItem} />
    </ScreenView>
  )
}

export default AnnouncementsScreen
