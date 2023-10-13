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
import { useGlobalStoreContext } from '@/state/hooks/useGlobalStoreContext'

type Props = object

const PurchaseBottomSheet = forwardRef<BottomSheet, Props>((props, ref) => {
  const t = useTranslation('PurchaseScreen')

  const { ticketPriceRequest } = useGlobalStoreContext()

  const insets = useSafeAreaInsets()
  const purchaseButtonContainerHeight = 24 + 12 + 48 + insets.bottom

  // 32 is just visually okay
  const snapPoints = useMemo(() => [32], [])

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
        index={1}
      >
        <BottomSheetContent cn="g-3" hideSpacer>
          {/* <FlexRow> */}
          {/*   <Typography variant="default">Parkovanie {formatDuration(Number(duration))}</Typography> */}
          {/*   <Typography variant="default-bold">? €</Typography> */}
          {/* </FlexRow> */}

          <Typography>{JSON.stringify(ticketPriceRequest)}</Typography>
          <Divider />

          {/* <FlexRow> */}
          {/*   <Typography variant="default-bold">{t('summary')}</Typography> */}
          {/*   <Typography variant="default-bold">2 €</Typography> */}
          {/* </FlexRow> */}
        </BottomSheetContent>
      </BottomSheet>

      <View style={{ height: purchaseButtonContainerHeight }} className="bg-white px-5 g-3">
        <FlexRow>
          <Typography variant="default-bold">{t('summary')}</Typography>
          <Typography variant="default-bold">2 €</Typography>
        </FlexRow>

        <Button>{t('pay')}</Button>
      </View>
    </>
  )
})

export default PurchaseBottomSheet
