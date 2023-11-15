import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { Link } from 'expo-router'
import React, { forwardRef, ReactNode, useCallback, useMemo, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MenuRow from '@/components/list-rows/MenuRow'
import NewAnnouncementsBadge from '@/components/navigation/MainMenu/NewAnnouncementsBadge'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import Divider from '@/components/shared/Divider'
import { IconName } from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useTranslation } from '@/hooks/useTranslation'
import { useSignOut } from '@/modules/cognito/hooks/useSignOut'
import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'

type Props = unknown

const styles = StyleSheet.create({
  sheetContainer: {
    // add horizontal space
    marginHorizontal: 24,
  },
})

const DIVIDER = 'divider'

const MainMenuBottomSheet = forwardRef<BottomSheet, Props>((props, ref) => {
  const t = useTranslation()
  const { top } = useSafeAreaInsets()

  const localRef = useRef<BottomSheet>(null)
  const refSetter = useMultipleRefsSetter(ref, localRef)

  const { user } = useGlobalStoreContext()
  const signOut = useSignOut()

  const menuItems: (
    | {
        label: string
        icon: IconName
        path: string
        endSlot?: ReactNode
      }
    | typeof DIVIDER
  )[] = [
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
      path: '/payment-options',
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
    DIVIDER,
    {
      label: t('Announcements.title'),
      icon: 'notifications',
      path: '/announcements',
      endSlot: <NewAnnouncementsBadge />,
    },
    {
      label: t('About.title'),
      icon: 'info',
      path: '/about',
    },
    DIVIDER,
    {
      label: 'DEV Menu',
      icon: 'developer-mode',
      path: '/dev',
    },
    {
      label: 'DEV Purchase',
      icon: 'payment',
      path: '/purchase',
    },
    {
      label: 'DEV User',
      icon: 'person',
      path: '/examples/user',
    },
  ]

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const snapPoints = useMemo(() => ['100%'], [])

  const handlePressClose = () => {
    localRef.current?.close()
  }

  const handleSignOut = () => {
    handlePressClose()
    signOut()
  }

  return (
    <BottomSheet
      ref={refSetter}
      index={-1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      detached
      enablePanDownToClose
      handleComponent={() => (
        <IconButton
          name="close"
          accessibilityLabel={t('Navigation.closeMenu')}
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
          {menuItems.map((item, index) =>
            item === DIVIDER ? (
              // eslint-disable-next-line react/no-array-index-key
              <Divider key={`divider-${index}`} dividerClassname="my-3" />
            ) : (
              <Link key={item.path} asChild href={item.path} onPress={handlePressClose}>
                <PressableStyled>
                  <MenuRow startIcon={item.icon} label={item.label} endSlot={item.endSlot} />
                </PressableStyled>
              </Link>
            ),
          )}
        </View>

        <View>
          {user ? (
            <PressableStyled onPress={handleSignOut}>
              <MenuRow variant="negative" endIcon="logout" label={t('Auth.signOut')} />
            </PressableStyled>
          ) : (
            <Link asChild href="/sign-in" onPress={handlePressClose}>
              <PressableStyled>
                <MenuRow endIcon="login" label={t('Auth.signIn')} />
              </PressableStyled>
            </Link>
          )}
        </View>
      </BottomSheetContent>
    </BottomSheet>
  )
})

export default MainMenuBottomSheet
