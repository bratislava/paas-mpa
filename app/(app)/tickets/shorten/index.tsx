import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { ScrollView, View } from 'react-native'

import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Markdown from '@/components/shared/Markdown'
import Typography from '@/components/shared/Typography'
import { useLiveActivities } from '@/hooks/useLiveActivities'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'

const Shorten = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { endLiveActivity } = useLiveActivities()

  const { ticketId } = useLocalSearchParams<{ ticketId: string }>()

  if (!ticketId) {
    router.replace('/tickets')
  }

  const shortenTicketMutation = useMutation({
    mutationFn: (id: number) => clientApi.ticketsControllerShortenTicket(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Tickets'] })
      queryClient.removeQueries({ queryKey: ['Tickets'] })

      await endLiveActivity(ticketId)

      router.replace({ pathname: '/tickets/shorten/shorten-result', params: { status: 'success' } })
    },
    onError: () => {
      router.replace({
        pathname: '/tickets/shorten/shorten-result',
        params: { status: 'error', ticketId },
      })
    },
  })

  const handleShortenTicket = () => {
    if (ticketId) {
      shortenTicketMutation.mutate(+ticketId)
    }
  }

  return (
    <ScreenView title={t('ShortenTicket.title')}>
      <ScreenContent>
        <View className="h-full g-4">
          <ScrollView className="shrink">
            <View className="grow">
              <Markdown>{t('ShortenTicket.infoText')}</Markdown>

              <View className="mt-5 g-1">
                <Typography variant="default-bold" className="mb-1">
                  {t('ShortenTicket.mainConditions')}
                </Typography>
                {[
                  t('ShortenTicket.conditions.1'),
                  t('ShortenTicket.conditions.2'),
                  t('ShortenTicket.conditions.3'),
                  t('ShortenTicket.conditions.4'),
                ].map((item) => (
                  <View key={item} className="max-w-full flex-row g-2">
                    <Typography>{`\u2022`}</Typography>
                    <Typography className="min-w-0 shrink">{item}</Typography>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <Button
            variant="negative"
            loading={shortenTicketMutation.isPending}
            onPress={handleShortenTicket}
          >
            {t('ShortenTicket.actionConfirm')}
          </Button>
        </View>
      </ScreenContent>
    </ScreenView>
  )
}

export default Shorten
