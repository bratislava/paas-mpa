import React from 'react'
import { View } from 'react-native'

import Button from '@/components/shared/Button'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'

const handlePress = () => {
  // eslint-disable-next-line no-console
  console.log('Button pressed')
}

const ButtonShowcase = () => (
  // eslint-disable-next-line react-native/no-inline-styles
  <View className="p-4 g-2">
    <FlexRow cn="justify-start">
      <IconButton name="add" accessibilityLabel="Add" />
      <IconButton name="add" accessibilityLabel="Add" variant="white-raised" />
      <IconButton name="add" accessibilityLabel="Add" variant="dark" />
      <IconButton name="add" accessibilityLabel="Add" variant="dark-small" />
      <IconButton name="add" accessibilityLabel="Add" variant="white-raised-small" />
      <IconButton name="add" accessibilityLabel="Add" variant="dark" disabled />
      <IconButton name="add" accessibilityLabel="Add" variant="white-raised" disabled />
    </FlexRow>
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
    <Button variant="primary" loading>
      Loading
    </Button>
    <Button variant="secondary" loading loadingText="Custom loading text">
      Custom loadingText
    </Button>
    <Button
      variant="tertiary"
      loading
      loadingText="Custom without ellipsis"
      loadingTextEllipsis={false}
    >
      Custom loadingText
    </Button>
  </View>
)

export default ButtonShowcase
