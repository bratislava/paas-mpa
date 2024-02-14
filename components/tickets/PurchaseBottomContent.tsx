import { UseQueryResult } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import PurchaseErrorPanel from '@/components/purchase/PurchaseErrorPanel'
import PurchaseSummaryRow from '@/components/purchase/PurchaseSummaryRow'
import Button from '@/components/shared/Button'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import PurchaseBottomSheet from '@/components/tickets/PurchaseBottomSheet'
import { useTranslation } from '@/hooks/useTranslation'
import { GetTicketPriceResponseDto } from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'

type Props = {
  priceQuery: UseQueryResult<GetTicketPriceResponseDto, Error>
  handlePressPay: () => void
  purchaseButtonContainerHeight: number
  isLoading?: boolean
  hasLicencePlateError?: boolean
  setPurchaseButtonContainerHeight: Dispatch<SetStateAction<number>>
}

/**
 * Bottom content of purchase screen
 */
const PurchaseBottomContent = ({
  handlePressPay,
  isLoading,
  priceQuery,
  setPurchaseButtonContainerHeight,
  purchaseButtonContainerHeight,
  hasLicencePlateError,
}: Props) => {
  const insets = useSafeAreaInsets()
  const t = useTranslation('PurchaseScreen')

  const { vehicle } = usePurchaseStoreContext()

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
            <Typography>{t(`Errors.LicencePlate`)}</Typography>
          </Panel>
        ) : null}

        <Button
          onPress={handlePressPay}
          disabled={hasLicencePlateError || !!(!priceQuery.data && vehicle?.vehiclePlateNumber)}
          loading={priceQuery.isFetching || isLoading}
        >
          {t('pay')}
        </Button>
      </View>
    </>
  )
}

export default PurchaseBottomContent
