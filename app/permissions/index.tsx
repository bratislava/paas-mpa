import clsx from 'clsx'
import { PermissionStatus } from 'expo-modules-core'
import { router, Stack } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneRendererProps, TabView } from 'react-native-tab-view'

import {
  PermissionsLocationImage,
  PermissionsNotificationsImage,
} from '@/assets/images/permissions'
import ContinueButton from '@/components/navigation/ContinueButton'
import { InfoSlide } from '@/components/screen-layout/InfoSlide'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'
import { useNotificationPermission } from '@/modules/map/hooks/useNotificationPermission'

type RouteKeys = 'notifications' | 'location'
type RouteProps = SceneRendererProps & {
  route: {
    key: RouteKeys
  }
}

const PermissionsRoute = ({ route, jumpTo }: RouteProps) => {
  const insets = useSafeAreaInsets()
  const t = useTranslation('PermissionsScreen')

  const {
    permissionStatus: notificationsPermissionStatus,
    getPermission: getNotificationsPermission,
  } = useNotificationPermission()
  const { permissionStatus: locationPermissionStatus, getPermission: getLocationPermission } =
    useLocationPermission()

  const image = {
    notifications: PermissionsNotificationsImage,
    location: PermissionsLocationImage,
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

  return (
    <View className="flex-1 flex-col justify-start">
      <InfoSlide title={t(`${route.key}.title`)} text={t(`${route.key}.text`)} image={image} />
      <ContinueButton
        className={clsx('mx-5', { 'mb-5': !insets.bottom })}
        onPress={getPermission}
      />
    </View>
  )
}

const renderScene = (routeProps: RouteProps) => {
  return <PermissionsRoute {...routeProps} />
}

const PermissionsScreen = () => {
  const layout = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const [index, setIndex] = useState(0)
  const [routes] = useState<{ key: RouteKeys }[]>([{ key: 'notifications' }, { key: 'location' }])

  return (
    <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
      <Stack.Screen options={{ headerShown: false }} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
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
