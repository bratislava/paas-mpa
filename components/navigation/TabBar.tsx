import { Dimensions, StyleSheet, View } from 'react-native'
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar as RNTabBar,
} from 'react-native-tab-view'

import Typography from '@/components/shared/Typography'
import colors from '@/tailwind.config.colors'
import { clsx } from '@/utils/clsx'

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
      labelStyle={styles.labelStyle}
      indicatorStyle={styles.indicatorStyle}
      renderLabel={({ route, focused }) => {
        return (
          <View className="items-center justify-center">
            <Typography
              variant="default-bold"
              className={clsx('text-dark', { 'text-green': focused })}
            >
              {route.title}
            </Typography>
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  indicatorStyle: { backgroundColor: colors.green.DEFAULT },
  labelStyle: { color: colors.green.DEFAULT },
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
