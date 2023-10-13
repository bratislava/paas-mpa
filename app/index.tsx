import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { Link, router, useNavigation } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ActionRow from '@/components/actions/ActionRow'
import MapScreen from '@/components/map/MapScreen'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import { IconName } from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'

const handleLongPress = () => {
  router.push('/dev')
}

const IndexScreen = () => {
  const t = useTranslation()
  const navigation = useNavigation()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { top } = useSafeAreaInsets()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const snapPoints = useMemo(() => ['100%'], [])

  const handlePressOpen = () => {
    bottomSheetRef.current?.expand()
  }

  const handlePressClose = () => {
    bottomSheetRef.current?.close()
  }

  const menuItems: {
    label: string
    icon: IconName
    path: string
  }[] = [
    {
      label: t('VehiclesScreen.title'),
      icon: 'directions-car',
      path: '/vehicles',
    },
    {
      label: t('ParkingCards.title'),
      icon: 'card-membership',
      path: '/parking-cards',
    },
    {
      label: t('PaymentMethods.title'),
      icon: 'payment',
      path: '/payment-methods',
    },
    {
      label: t('Tickets.title'),
      icon: 'local-parking',
      path: '/tickets',
    },
    {
      label: t('Settings.title'),
      icon: 'settings',
      path: '/settings',
    },
    {
      label: 'Purchase DEV',
      icon: 'payment',
      path: '/purchase',
    },
  ]

  return (
    <>
      <MapScreen />

      <View className="absolute right-0 px-2.5 g-3" style={{ top }}>
        <IconButton
          name="menu"
          // TODO translation
          accessibilityLabel="Open menu"
          variant="white-raised-small"
          onPress={handlePressOpen}
          onLongPress={handleLongPress}
        />

        {/* <Link asChild href="/user"> */}
        {/*   <IconButton */}
        {/*     name="person" */}
        {/*     accessibilityLabel="To be removed - temporary indicator that user is logged in" */}
        {/*     variant="dark-small" */}
        {/*   /> */}
        {/* </Link> */}
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        detached
        enablePanDownToClose
        handleComponent={() => (
          <IconButton
            name="close"
            // TODO translation
            accessibilityLabel="Close menu"
            className="absolute right-4 top-4"
            onPress={handlePressClose}
          />
        )}
        topInset={top + 80}
        bottomInset={50}
        style={styles.sheetContainer}
      >
        <BottomSheetContent cn="justify-between flex-1" hideSpacer>
          <View>
            {menuItems.map((item) => (
              // TODO Link+Pressable
              <Link
                key={item.path}
                asChild
                href={item.path}
                onPress={() => bottomSheetRef.current?.close()}
              >
                <PressableStyled>
                  <ActionRow startIcon={item.icon} label={item.label} />
                </PressableStyled>
              </Link>
            ))}
          </View>

          <View>
            <Link asChild href="/dev/" onPress={() => bottomSheetRef.current?.close()}>
              <PressableStyled>
                <ActionRow label="Dev menu" />
              </PressableStyled>
            </Link>

            {/* /!* eslint-disable-next-line @typescript-eslint/no-misused-promises *!/ */}
            {/* <PressableStyled onPress={signOut}> */}
            {/*   <ActionRow endIcon="logout" label="Logout" variant="negative" /> */}
            {/* </PressableStyled> */}

            {/* TODO TMP, replace by Login/Logout */}
            <Link asChild href="/user" onPress={() => bottomSheetRef.current?.close()}>
              <PressableStyled>
                <ActionRow endIcon="login" label="User" />
              </PressableStyled>
            </Link>
          </View>
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  sheetContainer: {
    // add horizontal space
    marginHorizontal: 24,
  },
})

export default IndexScreen
