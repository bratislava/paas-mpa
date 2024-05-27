import { forwardRef } from 'react'
import { View } from 'react-native'

import Button, { ButtonProps } from '@/components/shared/Button'
import { useTranslation } from '@/hooks/useTranslation'

type ContinueButtonProps = Omit<ButtonProps, 'children'> & {
  children?: string
}

/**
 * Simple button with default text "Continue" to be easier to use useTranslation hook in other components
 */
const ContinueButton = forwardRef<View, ContinueButtonProps>(
  ({ children, variant, ...rest }, ref) => {
    const { t } = useTranslation()

    return (
      <Button ref={ref} variant={variant ?? 'primary'} {...rest}>
        {children ?? t('Navigation.continue')}
      </Button>
    )
  },
)

export default ContinueButton
