import { useCallback, useEffect } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'

/** Run on app focus, does not run initially, substitute for `useFocusEffect` from 'expo-router'
 * which does not handle focus as well.
 */
export const useAppFocusEffect = (onFocus: () => void) => {
  /** Check if the app is active again, works on iOS but on Android there is no `inactive` state,
   * so that if the app is still in foreground, but obstructed by another element, like the notification drawer,
   * the state change will not trigger.
   */
  const appStateChangeHandler = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        onFocus()
      }
    },
    [onFocus],
  )

  /** Trigger on app focus, works only on Android */
  const appFocusHandler = useCallback(async () => {
    onFocus()
  }, [onFocus])

  useEffect(() => {
    const subscription =
      Platform.OS === 'ios'
        ? AppState.addEventListener('change', appStateChangeHandler)
        : AppState.addEventListener('focus', appFocusHandler)

    return () => {
      subscription.remove()
    }
  }, [appStateChangeHandler, appFocusHandler])
}
