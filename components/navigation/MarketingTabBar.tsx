import clsx from 'clsx'
import { StyleSheet, View } from 'react-native'
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar as RNTabBar,
} from 'react-native-tab-view'

import PressableStyled from '@/components/shared/PressableStyled'

const MarketingTabBar = (
  props: SceneRendererProps & { navigationState: NavigationState<Route> },
) => {
  return (
    <RNTabBar
      {...props}
      indicatorStyle={styles.indicatorStyle}
      contentContainerStyle={styles.contentContainerStyle}
      style={styles.style}
      renderTabBarItem={({ route, navigationState, onPress }) => {
        const isFocused = navigationState.index === navigationState.routes.indexOf(route)

        return (
          <PressableStyled accessibilityLabel={route.accessibilityLabel} onPress={onPress}>
            <View
              className={clsx(
                'items-center justify-center rounded-full border-2 border-transparent p-0.5',
                isFocused && 'border-green',
              )}
            >
              <View className="h-2 w-2 rounded-full bg-green" />
            </View>
          </PressableStyled>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  contentContainerStyle: { alignItems: 'center', gap: 12, justifyContent: 'center' },
  indicatorStyle: { display: 'none' },
  style: { backgroundColor: 'transparent' },
})

export default MarketingTabBar
