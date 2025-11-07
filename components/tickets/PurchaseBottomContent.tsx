import { UseQueryResult } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { Trans } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import PurchaseErrorPanel from '@/components/purchase/PurchaseErrorPanel'
import PurchaseSummaryRow from '@/components/purchase/PurchaseSummaryRow'
import Button from '@/components/shared/Button'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import PurchaseBottomSheet from '@/components/tickets/PurchaseBottomSheet'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { GetTicketPriceResponseDto } from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { formatTime } from '@/utils/formatTime'

type Props = {
  priceQuery: UseQueryResult<GetTicketPriceResponseDto, Error>
  handlePressPay: () => void
  purchaseButtonContainerHeight: number
  isLoading?: boolean
  duration?: number
  hasLicencePlateError?: boolean
  setPurchaseButtonContainerHeight: Dispatch<SetStateAction<number>>
}

/**
 * Bottom content of purchase screen
 */
const PurchaseBottomContent = ({
  handlePressPay,
  isLoading,
  duration,
  priceQuery,
  setPurchaseButtonContainerHeight,
  purchaseButtonContainerHeight,
  hasLicencePlateError,
}: Props) => {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const locale = useLocale()

  const { vehicle } = usePurchaseStoreContext()

  const isDifferentEnd =
    duration &&
    !priceQuery.isFetching &&
    priceQuery.data &&
    new Date(priceQuery.data.ticketEnd) > new Date(Date.now() + duration * 1000)

  return (
    <>
      <PurchaseBottomSheet
        priceData={priceQuery.data}
        purchaseButtonContainerHeight={purchaseButtonContainerHeight}
      />

      <View
        style={{ paddingBottom: insets.bottom + 20 }} // 20 is same as pb-5
        className="bg-white px-5 g-3"
        onLayout={(event) => {
          setPurchaseButtonContainerHeight(event.nativeEvent.layout.height)
        }}
      >
        <PurchaseSummaryRow priceData={priceQuery.data} />

        <PurchaseErrorPanel priceQuery={priceQuery} />

        {hasLicencePlateError ? (
          <Panel className="mt-3 bg-negative-light px-5">
            <Typography>{t('PurchaseScreen.Errors.LicencePlate')}</Typography>
          </Panel>
        ) : null}

        {isDifferentEnd ? (
          <Panel className="mt-3 bg-warning-light px-5">
            <Typography>
              <Trans
                t={t}
                tOptions={{ time: formatTime(new Date(priceQuery.data.ticketEnd), locale) }}
                shouldUnescape
              >
                PurchaseScreen.warnings.differentEnd
              </Trans>
            </Typography>
          </Panel>
        ) : null}

        <Button
          onPress={handlePressPay}
          disabled={hasLicencePlateError || !!(!priceQuery.data && vehicle?.vehiclePlateNumber)}
          loading={priceQuery.isFetching || isLoading}
        >
          {t('PurchaseScreen.pay')}
        </Button>
      </View>
    </>
  )
}

export default PurchaseBottomContent
