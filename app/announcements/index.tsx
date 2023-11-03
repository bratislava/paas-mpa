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
import { AnnouncementDto, AnnouncementType } from '@/modules/backend/openapi-generated'

export const mockedAnnouncements: AnnouncementDto[] = [
  {
    title: 'New feature release',
    content: 'We are excited to announce the release of our new feature. Check it out now!',
    type: AnnouncementType.Info,
    externalUrl: 'https://example.com/new-feature',
    id: 5,
    createdAt: '2022-01-20T00:00:00.000Z',
  },
  {
    title: 'New feature release',
    content: 'We are excited to announce the release of our new feature. Check it out now!',
    type: AnnouncementType.Info,
    externalUrl: 'https://example.com/new-feature',
    id: 4,
    createdAt: '2022-01-20T00:00:00.000Z',
  },
  {
    title: 'Holiday sale',
    content: "Get 20% off on all products during our holiday sale. Don't miss out!",
    type: AnnouncementType.Error,
    id: 3,
    createdAt: '2022-01-15T00:00:00.000Z',
  },
  {
    title: 'Important notice',
    content:
      'We will be performing maintenance on our servers on January 15th. Expect some downtime during this period.',
    type: AnnouncementType.Warn,
    id: 2,
    createdAt: '2022-01-10T00:00:00.000Z',
  },
  {
    title: 'New blog post',
    content: 'We have **published** a new blog post on our website. Check it out now!',
    type: AnnouncementType.Info,
    externalUrl: 'https://example.com/blog/new-post',
    id: 1,
    createdAt: '2022-01-05T00:00:00.000Z',
  },
]

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
