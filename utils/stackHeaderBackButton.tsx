import { router } from 'expo-router'

import IconButton from '@/components/shared/IconButton'

/**
 *  Stack header back button
 * @param canGoBack whether the router can go back
 * @returns back button if canGoBack is true, null otherwise
 */
export const stackHeaderBackButton = ({ canGoBack }: { canGoBack: boolean }) =>
  canGoBack ? (
    <IconButton onPress={router.back} accessibilityLabel="arrow-back" name="arrow-back" />
  ) : null
