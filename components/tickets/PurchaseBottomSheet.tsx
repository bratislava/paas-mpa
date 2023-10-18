import BottomSheet from '@gorhom/bottom-sheet'
import { forwardRef, useMemo } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import BottomSheetContent from '@/components/shared/BottomSheetContent'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { GetTicketPriceResponseDto } from '@/modules/backend/openapi-generated'
import { useGlobalStoreContext } from '@/state/hooks/useGlobalStoreContext'
import { formatDuration } from '@/utils/formatDuration'
import { formatPrice } from '@/utils/formatPrice'

type Props = {
  priceData: GetTicketPriceResponseDto | undefined
  isLoading?: boolean
}

const PurchaseBottomSheet = forwardRef<BottomSheet, Props>(({ priceData, isLoading }, ref) => {
  const t = useTranslation('PurchaseScreen')

  const { ticketPriceRequest } = useGlobalStoreContext()

  const insets = useSafeAreaInsets()
  // TODO tmp for now - fixed height from figma
  const purchaseButtonContainerHeight = 24 + 12 + 48 + insets.bottom

  // 24 is handle height
  const snapPoints = useMemo(() => [24], [])

  // const renderFooter = useCallback(
  //   (footerProps: BottomSheetFooterProps) => {
  //     return (
  //       // eslint-disable-next-line react-native/no-inline-styles
  //       <BottomSheetFooter style={{ backgroundColor: 'white' }} {...footerProps}>
  //         <View className="px-5">
  //           <Link href="/" asChild>
  //             <Button>{t('pay')}</Button>
  //           </Link>
  //         </View>
  //       </BottomSheetFooter>
  //     )
  //   },
  //   [t],
  // )

  return (
    <>
      <BottomSheet
        ref={ref}
        enableDynamicSizing
        // footerComponent={renderFooter}
        bottomInset={purchaseButtonContainerHeight}
        snapPoints={snapPoints}
      >
        {priceData ? (
          <BottomSheetContent cn="g-3" hideSpacer>
            <FlexRow>
              <Typography variant="default">
                Parkovanie {formatDuration(Number(ticketPriceRequest?.duration))}
              </Typography>
              <Typography variant="default-bold">
                {formatPrice(priceData.priceWithoutDiscount)}
              </Typography>
            </FlexRow>

            {/* Check if tax is present (null/undefined, but show if it is 0) */}
            {priceData.tax == null ? null : (
              <FlexRow>
                <Typography variant="default">Dan</Typography>
                <Typography variant="default-bold">{formatPrice(priceData.tax)}</Typography>
              </FlexRow>
            )}

            <Divider />
            {/* <Typography>{JSON.stringify(ticketPriceRequest)}</Typography> */}
          </BottomSheetContent>
        ) : null}
      </BottomSheet>

      <View style={{ height: purchaseButtonContainerHeight }} className="bg-white px-5 g-3">
        {priceData ? (
          <FlexRow>
            <Typography variant="default-bold">{t('summary')}</Typography>
            <Typography variant="default-bold">{formatPrice(priceData.priceTotal)}</Typography>
          </FlexRow>
        ) : null}

        <Button loading={isLoading}>{t('pay')}</Button>
      </View>
    </>
  )
})

export default PurchaseBottomSheet
