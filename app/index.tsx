import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { Link } from 'expo-router'
import Stack from 'expo-router/stack'
import { useCallback, useRef } from 'react'
import { FlatList, StyleSheet } from 'react-native'

import ActionRow from '@/components/actions/ActionRow'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import Button from '@/components/shared/Button'
import { IconName } from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'

const IndexScreen = () => {
  const t = useTranslation()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handlePress = () => {
    bottomSheetRef.current?.expand()
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
    <>
      <ScreenView>
        <Stack.Screen
          options={{
            // headerTransparent: true,
            headerRight: () => (
              <IconButton name="menu" accessibilityLabel="Open menu" onPress={handlePress} />
            ),
          }}
        />
        <ScreenContent>
          <Link href="/dev" asChild>
            <Button>Developer menu</Button>
          </Link>

          <Button onPress={handlePress} variant="tertiary">
            Manage app menu
          </Button>
        </ScreenContent>
      </ScreenView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        // enableDynamicSizing
        snapPoints={['100%']}
        backdropComponent={renderBackdrop}
        detached
        enablePanDownToClose
        topInset={50}
        bottomInset={50}
        style={styles.sheetContainer}
      >
        <BottomSheetContent cn="justify-between flex-1" hideSpacer>
          <FlatList
            data={menuItems}
            renderItem={({ item }) => (
              // TODO Link+Pressable
              <Link asChild href={item.path} onPress={() => bottomSheetRef.current?.close()}>
                <PressableStyled>
                  <ActionRow startIcon={item.icon} label={item.label} />
                </PressableStyled>
              </Link>
            )}
          />
          <PressableStyled>
            <ActionRow endIcon="logout" label="Logout" variant="negative" />
          </PressableStyled>
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
