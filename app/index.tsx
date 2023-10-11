import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { PortalHost } from '@gorhom/portal'
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
  ]

  return (
    <View className="flex-1">
      <MapScreen />

      <View className="absolute flex w-full flex-row justify-end px-2.5" style={{ top }}>
        <IconButton
          name="menu"
          // TODO translation
          accessibilityLabel="Open menu"
          variant="white-raised-small"
          onPress={handlePressOpen}
          onLongPress={handleLongPress}
        />
      </View>

      <PortalHost name="index" />

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
            <PressableStyled>
              <ActionRow endIcon="logout" label="Logout" variant="negative" />
            </PressableStyled>
          </View>
        </BottomSheetContent>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  sheetContainer: {
    // add horizontal space
    marginHorizontal: 24,
  },
})

export default IndexScreen
