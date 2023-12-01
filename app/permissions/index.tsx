import clsx from 'clsx'
import { PermissionStatus } from 'expo-modules-core'
import { router, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { ImageSourcePropType, useWindowDimensions, View } from 'react-native'
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
type RouteProps = {
  onPermissionFinished: () => void
  permissionStatus: PermissionStatus
  getPermission: () => Promise<void>
  image: ImageSourcePropType
  translationKey: string
}

const PermissionsRoute = ({
  onPermissionFinished,
  permissionStatus,
  getPermission,
  image,
  translationKey,
}: RouteProps) => {
  const insets = useSafeAreaInsets()
  const t = useTranslation('PermissionsScreen')

  useEffect(() => {
    if (permissionStatus !== PermissionStatus.UNDETERMINED) {
      onPermissionFinished()
    }
  }, [onPermissionFinished, permissionStatus])

  return (
    <View className="flex-1 flex-col justify-start">
      <InfoSlide
        title={t(`${translationKey}.title`)}
        text={t(`${translationKey}.text`)}
        image={image}
      />
      <ContinueButton
        className={clsx('mx-5', { 'mb-5': !insets.bottom })}
        onPress={getPermission}
      />
    </View>
  )
}

const NotificationsPermissionRoute = ({ jumpTo }: { jumpTo: (key: RouteKeys) => void }) => {
  const image = PermissionsNotificationsImage
  const { permissionStatus, getPermission } = useNotificationPermission()

  return (
    <PermissionsRoute
      permissionStatus={permissionStatus}
      getPermission={getPermission}
      onPermissionFinished={() => jumpTo('location')}
      image={image}
      translationKey="notifications"
    />
  )
}

const LocationPermissionRoute = () => {
  const image = PermissionsLocationImage
  const { permissionStatus, getPermission } = useLocationPermission()

  return (
    <PermissionsRoute
      permissionStatus={permissionStatus}
      getPermission={getPermission}
      onPermissionFinished={() => router.replace('/')}
      image={image}
      translationKey="location"
    />
  )
}

const renderScene = ({
  route,
  jumpTo,
}: SceneRendererProps & {
  route: {
    key: RouteKeys
  }
}) => {
  switch (route.key) {
    case 'notifications':
      return <NotificationsPermissionRoute jumpTo={jumpTo} />
    case 'location':
      return <LocationPermissionRoute />
    default:
      return null
  }
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
