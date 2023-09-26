import React from 'react'
import { View } from 'react-native'

import SegmentBadge from '@/components/info/SegmentBadge'
import TextInput from '@/components/inputs/TextInput'
import Field from '@/components/shared/Field'
import PanelPressable from '@/components/shared/PanelPressable'
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
        <PanelPressable>
          <Typography variant="default-bold">Some control</Typography>
        </PanelPressable>
      </Field>
      <Field label="Field with labelInsertArea" labelInsertArea={<SegmentBadge label="1059" />}>
        <PanelPressable>
          <Typography variant="default-bold">Some control</Typography>
        </PanelPressable>
      </Field>
    </View>
  )
}

export default FieldShowcase
