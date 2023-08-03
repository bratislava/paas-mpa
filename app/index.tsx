import { Example } from '@components/Example'
import { Text } from '@rneui/themed'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'

const IndexScreen = () => (
  <View style={styles.container}>
    <Link href="/map">
      <Text>Map</Text>
    </Link>
    <Example />
    <Text>Open up App.js to start working on your app!</Text>
    <StatusBar />
  </View>
)

export default IndexScreen

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
})
