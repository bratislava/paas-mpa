import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { forwardRef, useEffect, useMemo, useRef } from 'react'
import { View } from 'react-native'
import { useReducedMotion } from 'react-native-reanimated'

import BottomSheetHandleWithShadow, {
  HANDLE_HEIGHT,
} from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { getDurationFromPriceData } from '@/components/tickets/getDurationFromPriceData'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
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
    const { t } = useTranslation()
    const locale = useLocale()
    const { udr } = usePurchaseStoreContext()

    const snapPoints = useMemo(() => [HANDLE_HEIGHT], [])
    const reducedMotion = useReducedMotion()

    const localRef = useRef<BottomSheet>(null)
    const refSetter = useMultipleRefsSetter(localRef, ref)

    const durationFromPriceDate = getDurationFromPriceData(priceData)

    // Auto-expand the bottom sheet when the selected zone has additional information
    // (e.g. the warning that BPK cannot be used in 2e zones) so the user notices it.
    //
    // `expand()` is a no-op until gorhom has registered the dynamic content height as
    // a detent, which happens asynchronously on the UI thread after the scroll view
    // measures its children. We just retry a few times until it sticks; once it does,
    // further `expand()` calls become harmless no-ops.
    const additionalInfoText = udr?.additionalInformation ?? null
    const hasPriceData = !!priceData
    useEffect(() => {
      if (!hasPriceData || !additionalInfoText) return undefined

      const intervalId = setInterval(() => localRef.current?.expand(), 100)
      const timeoutId = setTimeout(() => clearInterval(intervalId), 1000)

      return () => {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
      }
    }, [hasPriceData, additionalInfoText])

    return (
      <BottomSheet
        ref={refSetter}
        enableDynamicSizing
        bottomInset={purchaseButtonContainerHeight}
        snapPoints={snapPoints}
        handleComponent={BottomSheetHandleWithShadow}
        animateOnMount={!reducedMotion}
      >
        {/**
         * Better approach for zero height bottom sheet: https://github.com/gorhom/react-native-bottom-sheet/issues/1573
         * fixes dynamic height of bottom sheet
         */}
        <BottomSheetScrollView scrollEnabled={false}>
          {priceData ? (
            <View className="px-5 py-3 g-3">
              <FlexRow>
                <Typography variant="default">
                  {t('PurchaseBottomSheet.parkingTime', {
                    time: formatDuration(durationFromPriceDate ?? 0),
                  })}
                </Typography>
                <Typography variant="default-bold">
                  {formatPrice(priceData.priceWithoutDiscount, locale)}
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
                  <Typography variant="default">
                    {t('PurchaseBottomSheet.creditNpkUsed')}
                  </Typography>
                  <Typography variant="default-bold">
                    {formatDuration(priceData.creditNpkUsedSeconds)}
                  </Typography>
                </FlexRow>
              ) : null}

              {priceData.creditBpkUsedSeconds ? (
                <FlexRow>
                  <Typography variant="default">
                    {t('PurchaseBottomSheet.creditBpkUsed')}
                  </Typography>
                  <Typography variant="default-bold">
                    {formatDuration(priceData.creditBpkUsedSeconds)}
                  </Typography>
                </FlexRow>
              ) : null}

              {isDefined(priceData.tax) ? (
                <FlexRow>
                  <Typography variant="default">{t('PurchaseBottomSheet.tax')}</Typography>
                  <Typography variant="default-bold">
                    {formatPrice(priceData.tax, locale)}
                  </Typography>
                </FlexRow>
              ) : null}

              <Divider />
            </View>
          ) : null}
        </BottomSheetScrollView>
      </BottomSheet>
    )
  },
)

export default PurchaseBottomSheet
