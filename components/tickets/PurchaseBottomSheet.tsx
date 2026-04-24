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
    // (e.g. warning that BPK cannot be used in 2e zones), so the user notices it.
    //
    // Calling `expand()` is a no-op until gorhom has finished computing the dynamic
    // detent (which happens asynchronously on the UI thread after the scroll view
    // measures its content). To work around this we:
    //   1. Track the sheet's current snap index via `onChange` so we know when the
    //      sheet is mounted and which index it's at.
    //   2. Track the measured content height via `onContentSizeChange`.
    //   3. Poll `expand()` for up to a second after both signals are ready, until
    //      the sheet actually moves to a non-collapsed index.
    // The `lastAutoExpandedFor` ref makes sure we only auto-expand once per zone so
    // we don't fight the user dragging the sheet back down.
    const additionalInfoText = udr?.additionalInformation ?? null

    // We read all "decision" inputs through refs because gorhom captures the first
    // `onChange` callback in a worklet and re-invokes it via `runOnJS`, so a closure
    // over `priceData` / `udr` would be stale. Refs always hold the latest values.
    const hasAdditionalInformationRef = useRef(false)
    const priceDataReadyRef = useRef(false)
    const additionalInfoTextRef = useRef<string | null>(null)
    const lastAutoExpandedFor = useRef<string | null>(null)
    const currentIndexRef = useRef<number>(-1)
    const measuredContentHeightRef = useRef<number>(0)

    hasAdditionalInformationRef.current = Boolean(udr?.additionalInformation)
    priceDataReadyRef.current = !!priceData
    additionalInfoTextRef.current = additionalInfoText

    useEffect(() => {
      if (!hasAdditionalInformationRef.current) {
        lastAutoExpandedFor.current = null
      }
    }, [additionalInfoText])

    const tryAutoExpand = () => {
      if (
        !hasAdditionalInformationRef.current ||
        !priceDataReadyRef.current ||
        measuredContentHeightRef.current <= HANDLE_HEIGHT ||
        currentIndexRef.current < 0 ||
        lastAutoExpandedFor.current === additionalInfoTextRef.current
      ) {
        return
      }

      lastAutoExpandedFor.current = additionalInfoTextRef.current

      let attempts = 0
      const maxAttempts = 10
      const intervalMs = 100
      const intervalId = setInterval(() => {
        attempts += 1
        if (currentIndexRef.current > 0 || attempts >= maxAttempts) {
          clearInterval(intervalId)
          return
        }
        localRef.current?.expand()
      }, intervalMs)
      localRef.current?.expand()
    }

    const handleContentSizeChange = (_width: number, height: number) => {
      measuredContentHeightRef.current = height
      tryAutoExpand()
    }

    const handleChange = (index: number) => {
      currentIndexRef.current = index
      tryAutoExpand()
    }

    // After priceData arrives we may already have all signals ready (mount + content
    // measured) but neither callback will fire again — so kick off the expand here.
    useEffect(() => {
      if (priceData) {
        tryAutoExpand()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [priceData, additionalInfoText])

    return (
      <BottomSheet
        ref={refSetter}
        enableDynamicSizing
        bottomInset={purchaseButtonContainerHeight}
        snapPoints={snapPoints}
        handleComponent={BottomSheetHandleWithShadow}
        animateOnMount={!reducedMotion}
        onChange={handleChange}
      >
        {/**
         * Better approach for zero height bottom sheet: https://github.com/gorhom/react-native-bottom-sheet/issues/1573
         * fixes dynamic height of bottom sheet
         */}
        <BottomSheetScrollView scrollEnabled={false} onContentSizeChange={handleContentSizeChange}>
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
