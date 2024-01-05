import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView, ScrollView, View } from 'react-native'

import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Markdown from '@/components/shared/Markdown'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'

const Shorten = () => {
  const t = useTranslation('ShortenTicket')
  const queryClient = useQueryClient()

  const { ticketId } = useLocalSearchParams<{ ticketId: string }>()

  if (!ticketId) {
    router.replace('/tickets')
  }

  const shortenTicketMutation = useMutation({
    mutationFn: (id: number) => clientApi.ticketsControllerShortenTicket(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['Tickets'] })

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
    <ScreenView title={t('title')} hasBackButton>
      <ScreenContent>
        <SafeAreaView>
          <View className="h-full g-4">
            <ScrollView className="shrink">
              <View className="grow">
                <Markdown>{t('infoText')}</Markdown>

                <View className="mt-5 g-1">
                  <Typography variant="default-bold" className="mb-1">
                    {t('mainConditions')}
                  </Typography>

                  {(t('conditions', { returnObjects: true }) as unknown as string[]).map((item) => (
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
              {t('actionConfirm')}
            </Button>
          </View>
        </SafeAreaView>
      </ScreenContent>
    </ScreenView>
  )
}

export default Shorten
