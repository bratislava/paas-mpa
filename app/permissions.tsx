import { router, Stack } from 'expo-router'
import { useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneRendererProps, TabView } from 'react-native-tab-view'

import { LocationPermissions } from '@/components/special/permissions/LocationPermissions'
import { NotificationPermissions } from '@/components/special/permissions/NotificationPermissions'

// TODO Use ScreenView

type RouteKeys = 'notifications' | 'location'
// key is nested inside router, because this is how `renderScene` provides it
// the type is generic and has to be manually set for handlers
type RouteProps = SceneRendererProps & {
  route: {
    key: RouteKeys
  }
}

export type RouteComponentProps = { onContinue: () => void }
type PermissionTab = { key: RouteKeys; component: (props: RouteComponentProps) => JSX.Element }

const PERMISSION_TABS: PermissionTab[] = [
  { key: 'notifications', component: NotificationPermissions },
  { key: 'location', component: LocationPermissions },
]

const renderScene = (routeProps: RouteProps, index: number) => {
  const onContinue = () => {
    const nextTab = PERMISSION_TABS[index + 1]

    if (nextTab) {
      routeProps.jumpTo(nextTab.key)
    } else {
      router.replace('/')
    }
  }

  const PermissionsComponent = PERMISSION_TABS.find(
    ({ key }) => key === routeProps.route.key,
  )?.component

  return PermissionsComponent ? <PermissionsComponent onContinue={onContinue} /> : null
}

const PermissionsScreen = () => {
  const layout = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const [index, setIndex] = useState(0)

  return (
    <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
      <Stack.Screen options={{ headerShown: false }} />

      <TabView<PermissionTab>
        navigationState={{ index, routes: PERMISSION_TABS }}
        renderScene={(props) => renderScene(props, index)}
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
