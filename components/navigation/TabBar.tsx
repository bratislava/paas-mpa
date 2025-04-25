import { Dimensions, StyleSheet } from 'react-native'
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar as RNTabBar,
} from 'react-native-tab-view'

import colors from '@/tailwind.config.colors'

const TabBar = ({
  navigationState,
  ...props
}: SceneRendererProps & { navigationState: NavigationState<Route> }) => {
  return (
    <RNTabBar
      {...props}
      navigationState={navigationState}
      style={styles.style}
      tabStyle={{ width: Dimensions.get('window').width / navigationState.routes.length }}
      indicatorStyle={styles.indicatorStyle}
    />
  )
}

const styles = StyleSheet.create({
  indicatorStyle: { backgroundColor: colors.green.DEFAULT },
  style: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    width: Dimensions.get('window').width,
  },
})

export default TabBar
