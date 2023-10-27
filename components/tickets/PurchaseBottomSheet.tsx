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
import { formatDuration } from '@/utils/formatDuration'
import { formatPeriodOfTime } from '@/utils/formatPeriodOfTime'
import { formatPrice } from '@/utils/formatPrice'

type Props = {
  priceData: GetTicketPriceResponseDto | undefined
  isLoading?: boolean
}

const PurchaseBottomSheet = forwardRef<BottomSheet, Props>(({ priceData, isLoading }, ref) => {
  const t = useTranslation('PurchaseScreen')

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

  // TODO use seconds
  const getDurationFromPriceData = () => {
    if (!priceData) {
      return 0
    }

    const ticketStartDate = new Date(priceData.ticketStart)
    const ticketEndDate = new Date(priceData.ticketEnd)

    return (ticketEndDate.getTime() - ticketStartDate.getTime()) / 1000 / 60
  }

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
                Parkovanie {formatDuration(getDurationFromPriceData())}
              </Typography>
              <Typography variant="default-bold">
                {formatPrice(priceData.priceWithoutDiscount)}
              </Typography>
            </FlexRow>

            {/* Check if it is present (null/undefined, but show if it is 0) */}
            {priceData.creditNpkUsed == null ? null : (
              <FlexRow>
                <Typography variant="default">Stiahnuté z návštevníckej karty</Typography>
                <Typography variant="default-bold">
                  {formatPeriodOfTime(priceData.creditNpkUsed)}
                </Typography>
              </FlexRow>
            )}

            {/* Check if it is present (null/undefined, but show if it is 0) */}
            {priceData.creditBPKUsed == null ? null : (
              <FlexRow>
                <Typography variant="default">Stiahnuté z bonusovej karty</Typography>
                <Typography variant="default-bold">
                  {formatPeriodOfTime(priceData.creditBPKUsed)}
                </Typography>
              </FlexRow>
            )}

            {/* Check if it is present (null/undefined, but show if it is 0) */}
            {priceData.tax == null ? null : (
              <FlexRow>
                <Typography variant="default">Dan</Typography>
                <Typography variant="default-bold">{formatPrice(priceData.tax)}</Typography>
              </FlexRow>
            )}

            <Divider />
          </BottomSheetContent>
        ) : null}
      </BottomSheet>

      <View style={{ height: purchaseButtonContainerHeight }} className="bg-white px-5 g-3">
        {/* Toggling visibility prevents layout shifts */}
        <FlexRow className={priceData ? 'visible' : 'invisible'}>
          <Typography variant="default-bold">{t('summary')}</Typography>
          {priceData ? (
            <Typography variant="default-bold">{formatPrice(priceData.priceTotal)}</Typography>
          ) : null}
        </FlexRow>

        <Button loading={isLoading}>{t('pay')}</Button>
      </View>
    </>
  )
})

export default PurchaseBottomSheet
