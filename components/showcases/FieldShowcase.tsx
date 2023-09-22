import React from 'react'
import { View } from 'react-native'

import SegmentBadge from '@/components/info/SegmentBadge'
import TextInput from '@/components/inputs/TextInput'
import Field from '@/components/shared/Field'
import Panel from '@/components/shared/Panel'
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
        <Panel isPressable>
          <Typography variant="default-bold">Some control</Typography>
        </Panel>
      </Field>
      <Field label="Field with labelInsertArea" labelInsertArea={<SegmentBadge label="1059" />}>
        <Panel isPressable>
          <Typography variant="default-bold">Some control</Typography>
        </Panel>
      </Field>
    </View>
  )
}

export default FieldShowcase
