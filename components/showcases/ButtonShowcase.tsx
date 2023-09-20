import React from 'react'
import { View } from 'react-native'

import Button from '@/components/shared/Button'

const handlePress = () => {
  // eslint-disable-next-line no-console
  console.log('Button pressed')
}

const ButtonShowcase = () => (
  // eslint-disable-next-line react-native/no-inline-styles
  <View className="p-4 g-2">
    <Button variant="primary" onPress={handlePress}>
      Primary
    </Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="tertiary">Tertiary</Button>
    <Button variant="negative">Negative</Button>
    {/* <Button variant="floating" >Floating</Button> */}
    <Button variant="plain">Plain</Button>
    <Button variant="plain-dark">Plain dark</Button>
    <Button variant="primary" disabled>
      Disabled
    </Button>
    <Button variant="plain" disabled>
      Disabled plain
    </Button>
    <Button variant="primary" startIcon="add">
      With icon
    </Button>
    <Button variant="plain-dark" startIcon="add-circle-outline">
      Plain with icon
    </Button>
    <Button variant="primary" isLoading>
      Plain with icon
    </Button>
  </View>
)

export default ButtonShowcase
