import { router, Stack } from 'expo-router'
import { useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneRendererProps, TabView } from 'react-native-tab-view'

import { LocationPermissionSlide } from '@/components/special/permissions/LocationPermissionSlide'
import { NotificationPermissionSlide } from '@/components/special/permissions/NotificationPermissionSlide'

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
  { key: 'notifications', component: NotificationPermissionSlide },
  { key: 'location', component: LocationPermissionSlide },
]

const renderScene = ({ jumpTo, route }: RouteProps, index: number) => {
  const sceneTabIndex = PERMISSION_TABS.findIndex(({ key }) => key === route.key)

  const onContinue = () => {
    const nextTab = PERMISSION_TABS[sceneTabIndex + 1]
    if (nextTab) {
      jumpTo(nextTab.key)
    } else {
      router.replace('/')
    }
  }

  const PermissionsComponent = PERMISSION_TABS[sceneTabIndex]?.component

  // render only the current tab to ensure permissions are requested in order and not all at once
  return sceneTabIndex === index && PermissionsComponent ? (
    <PermissionsComponent onContinue={onContinue} />
  ) : null
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
        // calling router.replace() during the animation causes a crash
        animationEnabled={false}
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
