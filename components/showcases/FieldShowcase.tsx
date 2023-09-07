import React from 'react'
import { View } from 'react-native'

import TextInput from '@/components/inputs/TextInput'
import Field from '@/components/shared/Field'
import SegmentBadge from '@/components/shared/SegmentBadge'
import Surface from '@/components/shared/Surface'
import Typography from '@/components/shared/Typography'

const FieldShowcase = () => {
  return (
    <View className="p-4 g-4">
      <Field label="Text field">
        <TextInput />
      </Field>

      <Field label="Text field with errorMessage" errorMessage="Error message">
        <TextInput hasError />
      </Field>

      <Field label="Simple field">
        <Surface touchable>
          <Typography variant="default-bold">Some control</Typography>
        </Surface>
      </Field>
      <Field label="Field with labelInsertArea" labelInsertArea={<SegmentBadge label="1059" />}>
        <Surface touchable>
          <Typography variant="default-bold">Some control</Typography>
        </Surface>
      </Field>
    </View>
  )
}

export default FieldShowcase
