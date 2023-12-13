import { useCallback, useEffect, useRef } from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import Announcement from '@/components/info/Announcement'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { announcementsOptions } from '@/modules/backend/constants/queryOptions'
import { useLastReadAnnouncementIdStorage } from '@/modules/backend/hooks/useLastReadAnnouncementIdStorage'
import { AnnouncementDto } from '@/modules/backend/openapi-generated'

const AnnouncementsScreen = () => {
  const t = useTranslation('Announcements')
  const locale = useLocale()

  const { data, isPending, isError, error } = useQueryWithFocusRefetch(announcementsOptions(locale))

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
    return <LoadingScreen asScreenView />
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>
  }

  if (data.announcements.length === 0) {
    return (
      <EmptyStateScreen hasBackButton title={t('title')} contentTitle={t('noAnnouncementsTitle')} />
    )
  }

  return (
    <ScreenView title={t('title')} hasBackButton>
      <FlatList data={data.announcements} renderItem={renderItem} />
    </ScreenView>
  )
}

export default AnnouncementsScreen
