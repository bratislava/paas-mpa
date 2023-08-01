import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

const App = () => (
  <View style={styles.container}>
    <Text>Open up App.js to start working on your app!</Text>
    <StatusBar />
  </View>
)

export default App

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
})
