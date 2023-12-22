import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView, View } from 'react-native'

import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { shortenPriceOptions } from '@/modules/backend/constants/queryOptions'

const Shorten = () => {
  const t = useTranslation('ShortenTicket')
  const queryClient = useQueryClient()

  const { ticketId } = useLocalSearchParams<{ ticketId: string }>()
  console.log(ticketId)
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

  const shortenPrice = useQueryWithFocusRefetch(shortenPriceOptions(+ticketId!))

  const handleShortenTicket = () => {
    if (ticketId) {
      shortenTicketMutation.mutate(+ticketId)
    }
  }

  console.log(shortenPrice.data, shortenPrice.error)

  return (
    <ScreenView title={t('title')} hasBackButton>
      <SafeAreaView className="grow">
        {shortenPrice.isFetching || !shortenPrice.data ? null : (
          <ScreenContent className="grow">
            <View className="grow g-5">
              <Typography>{t('infoText')}</Typography>

              <View className="g-2">
                <Typography variant="default-bold">{t('shortenConditions')}</Typography>
              </View>
            </View>

            <Button
              variant="negative"
              loading={shortenTicketMutation.isPending}
              onPress={handleShortenTicket}
            >
              {t('actionConfirm')}
            </Button>
          </ScreenContent>
        )}
      </SafeAreaView>
    </ScreenView>
  )
}

export default Shorten
