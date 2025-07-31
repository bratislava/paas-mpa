import { cloneElement, type JSX, useId } from 'react'

import Field, { FieldProps } from '@/components/shared/Field'

/**
 * Field component that passes accessibilityLabelledBy prop to children and connects it with nativeID inside Field component
 * @param children child component that will have automatically accessibilityLabelledBy prop
 */
const AccessibilityField = ({ children, ...passingProps }: Omit<FieldProps, 'nativeID'>) => {
  const generatedId = useId()

  return (
    <Field nativeID={generatedId} {...passingProps}>
      {cloneElement(children as JSX.Element, {
        accessibilityLabelledBy: generatedId,
        accessibilityLabel: passingProps.label,
      })}
    </Field>
  )
}

export default AccessibilityField
