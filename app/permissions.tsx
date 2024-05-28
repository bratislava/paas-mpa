import { router, Stack } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneRendererProps, TabView } from 'react-native-tab-view'

import { ImageLocationPermissions, ImageNotificationPermission } from '@/assets/onboarding-slides'
import ContinueButton from '@/components/navigation/ContinueButton'
import InfoSlide from '@/components/screen-layout/InfoSlide'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'
import { useNotificationPermission } from '@/modules/map/hooks/useNotificationPermission'
import { cn } from '@/utils/cn'
import { PermissionStatus } from '@/utils/types'

// TODO Use ScreenView

type RouteKeys = 'notifications' | 'location'
// key is nested inside router, because this is how `renderScene` provides it
// the type is generic and has to be manually set for handlers
type RouteProps = SceneRendererProps & {
  route: {
    key: RouteKeys
  }
}

const PermissionsRoute = ({ route, jumpTo }: RouteProps) => {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()

  const [notificationsPermissionStatus, getNotificationsPermission] = useNotificationPermission()
  const [locationPermissionStatus, getLocationPermission] = useLocationPermission()

  const SvgImage = {
    notifications: ImageNotificationPermission,
    location: ImageLocationPermissions,
  }[route.key]
  const permissionStatus =
    route.key === 'notifications' ? notificationsPermissionStatus : locationPermissionStatus
  const getPermission =
    route.key === 'notifications' ? getNotificationsPermission : getLocationPermission
  const onPermissionFinished = useCallback(() => {
    if (route.key === 'notifications') {
      jumpTo('location')
    } else {
      router.replace('/')
    }
  }, [route.key, jumpTo])

  useEffect(() => {
    if (permissionStatus !== PermissionStatus.UNDETERMINED) {
      onPermissionFinished()
    }
  }, [onPermissionFinished, permissionStatus])

  const translationMap = {
    notifications: {
      title: t('PermissionsScreen.notifications.title'),
      text: t('PermissionsScreen.notifications.text'),
    },
    location: {
      title: t('PermissionsScreen.location.title'),
      text: t('PermissionsScreen.location.text'),
    },
  } satisfies Record<RouteKeys, any>

  return (
    <View className="flex-1 justify-start">
      <InfoSlide
        title={translationMap[route.key].title}
        text={translationMap[route.key].text}
        SvgImage={SvgImage}
      />
      <ContinueButton className={cn('mx-5', { 'mb-5': !insets.bottom })} onPress={getPermission} />
    </View>
  )
}

const renderScene = (routeProps: RouteProps, activeKey: RouteKeys) => {
  return activeKey === routeProps.route.key ? <PermissionsRoute {...routeProps} /> : null
}

const PermissionsScreen = () => {
  const layout = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const [index, setIndex] = useState(0)
  const [routes] = useState<{ key: RouteKeys }[]>([{ key: 'notifications' }, { key: 'location' }])

  return (
    <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
      <Stack.Screen options={{ headerShown: false }} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={(props) => renderScene(props, routes[index].key)}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={() => null}
        tabBarPosition="bottom"
        className="pb-5"
        swipeEnabled={false}
        style={{ paddingTop: insets.top }}
      />
    </View>
  )
}

export default PermissionsScreen
