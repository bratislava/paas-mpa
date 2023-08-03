import Mapbox from '@rnmapbox/maps'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const MapScreen = () => (
  <View style={styles.page}>
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map} />
    </View>
  </View>
)

export default MapScreen

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: 300,
  },
  map: {
    flex: 1,
  },
  page: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})
