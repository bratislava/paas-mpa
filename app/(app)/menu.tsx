import { Link, router } from 'expo-router'
import { ReactNode } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MenuRow from '@/components/list-rows/MenuRow'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import { IconName } from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import { environment } from '@/environment'
import { useTranslation } from '@/hooks/useTranslation'
import { useSignOut } from '@/modules/cognito/hooks/useSignOut'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'

const DIVIDER = 'divider'

type MenuItemsType =
  | {
      label: string
      icon: IconName
      path: string
      endSlot?: ReactNode
    }
  | typeof DIVIDER

const MainMenuScreen = () => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()

  const { user } = useAuthStoreContext()
  const signOut = useSignOut()

  const menuItems: MenuItemsType[] = [
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
    // TODO: Implement announcements in V2... hidden for now
    // {
    //   label: t('Announcements.title'),
    //   icon: 'notifications',
    //   path: '/announcements',
    //   endSlot: <NewAnnouncementsBadge />,
    // },
    {
      label: t('FeedbackScreen.title'),
      icon: 'feedback',
      path: '/feedback',
    },
    {
      label: t('AboutScreen.title'),
      icon: 'info',
      path: '/about',
    },
    ...(environment.deployment === 'development'
      ? ([
          DIVIDER,
          {
            label: 'DEV Menu',
            icon: 'developer-mode',
            path: '/dev',
          },
        ] as MenuItemsType[])
      : []),
  ]

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handlePressClose = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  const handleSignOut = () => {
    handlePressClose()
    signOut()
  }

  return (
    <View className="flex-1">
      <ScreenView
        className="grow p-5"
        style={{ paddingBottom: bottom + 20 }} // 20 is same as pb-5
        title={t('Navigation.menu')}
      >
        <View className="flex-1 justify-between">
          <View>
            {menuItems.map((item, index) =>
              item === DIVIDER ? (
                // eslint-disable-next-line react/no-array-index-key
                <Divider key={`divider-${index}`} dividerClassname="my-3" />
              ) : (
                <Link key={item.path} asChild href={item.path}>
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
