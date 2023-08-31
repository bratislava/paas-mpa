import React from 'react'
import { View } from 'react-native'

import Button from '@/components/shared/Button'

const ButtonShowcase = () => (
  // eslint-disable-next-line react-native/no-inline-styles
  <View style={{ padding: 16, flex: 1, flexDirection: 'column', gap: 12 }}>
    <Button title="Primary" variant="primary" />
    <Button title="Secondary" variant="secondary" />
    <Button title="Tertiary" variant="tertiary" />
    <Button title="Negative" variant="negative" />
    <Button title="Floating" variant="floating" />
    <Button title="Plain primary" variant="plain-primary" />
    <Button title="Plain secondary" variant="plain-secondary" />
    <Button title="Primary" variant="primary" disabled />
  </View>
)

export default ButtonShowcase
