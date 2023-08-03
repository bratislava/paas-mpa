import DeveloperMenu from '@components/DeveloperMenu'
import { StyleSheet, View } from 'react-native'

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
