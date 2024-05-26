import { forwardRef } from 'react'
import { View } from 'react-native'

import Button, { ButtonProps } from '@/components/shared/Button'
import { useTranslation } from '@/hooks/useTranslation'

type ContinueButtonProps = Omit<ButtonProps, 'children'> &
  (
    | {
        children?: never
        translationKey?: never
      }
    | {
        children: string
        translationKey?: never
      }
    | {
        children?: never
        /** Translation key from the `Navigation` namespace. */
        translationKey: string
      }
  )

/**
 * Simple button with default text "Continue" to be easier to use useTranslation hook in other components
 */
const ContinueButton = forwardRef<View, ContinueButtonProps>(
  ({ children, variant, translationKey, ...rest }, ref) => {
    const { t } = useTranslation()

    return (
      <Button ref={ref} variant={variant ?? 'primary'} {...rest}>
        {children ?? (translationKey ? t(translationKey) : null) ?? t('Navigation.continue')}
      </Button>
    )
  },
)

export default ContinueButton
