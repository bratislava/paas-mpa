import { StyleSheet, View } from 'react-native'

import DeveloperMenu from '@/components/DeveloperMenu'

const IndexScreen = () => (
  <View style={styles.container}>
    <DeveloperMenu />
  </View>
)

export default IndexScreen

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
  },
})
