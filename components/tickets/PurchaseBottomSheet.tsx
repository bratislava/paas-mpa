import BottomSheet from '@gorhom/bottom-sheet'
import { forwardRef, useMemo } from 'react'

import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow, {
  HANDLE_HEIGHT,
} from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { getDurationFromPriceData } from '@/components/tickets/getDurationFromPriceData'
import { useTranslation } from '@/hooks/useTranslation'
import { GetTicketPriceResponseDto } from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { formatDuration } from '@/utils/formatDuration'
import { formatPrice } from '@/utils/formatPrice'
import { isDefined } from '@/utils/isDefined'

type Props = {
  priceData: GetTicketPriceResponseDto | undefined
  purchaseButtonContainerHeight: number
}

const PurchaseBottomSheet = forwardRef<BottomSheet, Props>(
  ({ priceData, purchaseButtonContainerHeight }, ref) => {
    const t = useTranslation('PurchaseBottomSheet')
    const { udr } = usePurchaseStoreContext()

    const snapPoints = useMemo(() => [HANDLE_HEIGHT], [])

    const durationFromPriceDate = getDurationFromPriceData(priceData)

    return (
      <BottomSheet
        ref={ref}
        enableDynamicSizing
        bottomInset={purchaseButtonContainerHeight}
        snapPoints={snapPoints}
        handleComponent={BottomSheetHandleWithShadow}
      >
        <BottomSheetContent cn="g-3" hideSpacer>
          {priceData ? (
            <>
              <FlexRow>
                <Typography variant="default">
                  {t('parkingTime', { time: formatDuration(durationFromPriceDate ?? 0) })}
                </Typography>
                <Typography variant="default-bold">
                  {formatPrice(priceData.priceWithoutDiscount)}
                </Typography>
              </FlexRow>

              {/* Is this ever used? */}
              {udr?.rpkInformation ? (
                <Panel className="bg-warning-light">
                  <Typography>{udr.rpkInformation}</Typography>
                </Panel>
              ) : null}

              {udr?.npkInformation ? (
                <Panel className="bg-warning-light">
                  <Typography>{udr.npkInformation}</Typography>
                </Panel>
              ) : null}

              {/* This usually says you cannot use BPK (in 2e zones) */}
              {udr?.additionalInformation ? (
                <Panel className="bg-warning-light">
                  <Typography>{udr.additionalInformation}</Typography>
                </Panel>
              ) : null}

              {priceData.creditNpkUsedSeconds ? (
                <FlexRow>
                  <Typography variant="default">{t('creditNpkUsed')}</Typography>
                  <Typography variant="default-bold">
                    {formatDuration(priceData.creditNpkUsedSeconds)}
                  </Typography>
                </FlexRow>
              ) : null}

              {priceData.creditBpkUsedSeconds ? (
                <FlexRow>
                  <Typography variant="default">{t('creditBpkUsed')}</Typography>
                  <Typography variant="default-bold">
                    {formatDuration(priceData.creditBpkUsedSeconds)}
                  </Typography>
                </FlexRow>
              ) : null}

              {isDefined(priceData.tax) ? (
                <FlexRow>
                  <Typography variant="default">{t('tax')}</Typography>
                  <Typography variant="default-bold">{formatPrice(priceData.tax)}</Typography>
                </FlexRow>
              ) : null}

              <Divider />
            </>
          ) : null}
        </BottomSheetContent>
      </BottomSheet>
    )
  },
)

export default PurchaseBottomSheet
