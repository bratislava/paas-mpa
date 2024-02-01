import { View } from 'react-native'

import ZoneBadge from '@/components/info/ZoneBadge'
import TextInput from '@/components/inputs/TextInput'
import AccessibilityField from '@/components/shared/AccessibilityField'
import Field from '@/components/shared/Field'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

const FieldShowcase = () => {
  return (
    <View className="p-4 g-4">
      <AccessibilityField label="Text field">
        <TextInput />
      </AccessibilityField>

      <AccessibilityField label="Text field with errorMessage" errorMessage="Error message">
        <TextInput hasError />
      </AccessibilityField>

      <Field label="Simple field">
        <PressableStyled>
          <Panel>
            <Typography variant="default-bold">Some control</Typography>
          </Panel>
        </PressableStyled>
      </Field>
      <Field label="Field with labelInsertArea" labelInsertArea={<ZoneBadge label="1059" />}>
        <PressableStyled>
          <Panel>
            <Typography variant="default-bold">Some control</Typography>
          </Panel>
        </PressableStyled>
      </Field>
    </View>
  )
}

export default FieldShowcase
