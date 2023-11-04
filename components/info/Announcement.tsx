import { Link } from 'expo-router'
import { View } from 'react-native'

import SeveritySquare from '@/components/info/SeveritySquare'
import FlexRow from '@/components/shared/FlexRow'
import Markdown from '@/components/shared/Markdown'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { AnnouncementDto } from '@/modules/backend/openapi-generated'
import { formatDateTime } from '@/utils/formatDateTime'

type Props = {
  announcement: AnnouncementDto
  isNew?: boolean
}

const Announcement = ({ announcement, isNew = true }: Props) => {
  const t = useTranslation('Announcements')
  const locale = useLocale()

  return (
    <View className="px-5">
      <FlexRow className="border-b border-divider py-4 g-4">
        <View>
          <SeveritySquare variant={announcement.type} />
          {isNew && (
            <View className="absolute -left-1 -top-1 rounded-full bg-white p-1">
              <View className="h-2 w-2 rounded-full bg-warning" />
            </View>
          )}
        </View>
        <View className="flex-1 g-3">
          <View className="flex-1">
            <Markdown>{announcement.content}</Markdown>
            {announcement.externalUrl ? (
              <Link asChild href={announcement.externalUrl}>
                <PressableStyled>
                  <Typography variant="small-bold" className="text-green">
                    {t('learnMore')}
                  </Typography>
                </PressableStyled>
              </Link>
            ) : null}
          </View>
          <View>
            <Typography variant="small">
              {formatDateTime(new Date(announcement.createdAt), locale)}
            </Typography>
          </View>
        </View>
      </FlexRow>
    </View>
  )
}

export default Announcement
