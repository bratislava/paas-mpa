import { Link, router } from 'expo-router'
import { ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MenuRow from '@/components/list-rows/MenuRow'
import NewAnnouncementsBadge from '@/components/navigation/MainMenu/NewAnnouncementsBadge'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import { IconName } from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { useSignOut } from '@/modules/cognito/hooks/useSignOut'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'

const DIVIDER = 'divider'

const MainMenuScreen = () => {
  const t = useTranslation()
  const { top } = useSafeAreaInsets()

  const { user } = useAuthStoreContext()
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
      label: t('AboutScreen.title'),
      icon: 'info',
      path: '/about',
    },
    // DIVIDER,
    // {
    //   label: 'DEV Menu',
    //   icon: 'developer-mode',
    //   path: '/dev',
    // },
    // {
    //   label: 'DEV Purchase',
    //   icon: 'payment',
    //   path: '/purchase',
    // },
    // {
    //   label: 'DEV User',
    //   icon: 'person',
    //   path: '/examples/user',
    // },
  ]

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handlePressClose = () => {
    if (router.canGoBack()) {
      router.back()
    }
  }

  const handleSignOut = () => {
    handlePressClose()
    signOut()
  }

  return (
    <View className="flex-1 flex-row">
      <Pressable className="min-w-0 flex-1" pointerEvents="box-only" onPress={handlePressClose} />
      <ScreenView
        className="min-w-[250px] flex-grow px-5"
        style={{ paddingBottom: 50, paddingTop: top + 80 }}
      >
        <View className="flex-1 justify-between">
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
        </View>
      </ScreenView>
    </View>
  )
}

export default MainMenuScreen
