import React from 'react'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'

const TypographyShowcase = () => {
  return (
    <View className="p-4 g-4">
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="default">Text default (16px)</Typography>
      <Typography variant="default-semibold">Text default semibold (16px)</Typography>
      <Typography variant="default-bold">Text default bold (16px)</Typography>
      <Typography variant="small">Text small (14px)</Typography>
      <Typography variant="small-semibold">Text small semibold (14px)</Typography>
      <Typography variant="small-bold">Text small bold (14px)</Typography>
    </View>
  )
}

export default TypographyShowcase
