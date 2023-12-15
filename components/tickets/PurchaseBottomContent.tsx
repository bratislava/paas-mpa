import { UseQueryResult } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTranslation } from '@/hooks/useTranslation'
import { GetTicketPriceResponseDto } from '@/modules/backend/openapi-generated'

import PurchaseErrorPanel from '../purchase/PurchaseErrorPanel'
import PurchaseSummaryRow from '../purchase/PurchaseSummaryRow'
import Button from '../shared/Button'
import PurchaseBottomSheet from './PurchaseBottomSheet'

type Props = {
  priceQuery: UseQueryResult<GetTicketPriceResponseDto, Error>
  handlePressPay: () => void
  purchaseButtonContainerHeight: number
  isLoading?: boolean
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
}: Props) => {
  const insets = useSafeAreaInsets()
  const t = useTranslation('PurchaseScreen')

  return (
    <>
      <PurchaseBottomSheet
        priceData={priceQuery.data}
        purchaseButtonContainerHeight={purchaseButtonContainerHeight}
      />

      <View
        style={{ paddingBottom: insets.bottom }}
        className="bg-white px-5 g-3"
        onLayout={(event) => {
          setPurchaseButtonContainerHeight(event.nativeEvent.layout.height)
        }}
      >
        <PurchaseSummaryRow priceData={priceQuery.data} />

        <PurchaseErrorPanel priceQuery={priceQuery} />

        <Button
          onPress={handlePressPay}
          disabled={!priceQuery.data}
          loading={priceQuery.isFetching || isLoading}
        >
          {t('pay')}
        </Button>
      </View>
    </>
  )
}

export default PurchaseBottomContent