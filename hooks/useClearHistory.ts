import { useNavigation } from 'expo-router'

/**
 * Hook that clears the navigation history.
 * @returns function that clears the navigation history and only leaves the current screen in the history.
 * @usage should be used after the route change to have only one screen in the history.
 */
export const useClearHistory = () => {
  const navigation = useNavigation()

  return () => {
    const state = navigation.getState()

    navigation.reset({
      ...state,
      index: 0,
      routes: [state.routes.at(-1)!],
    })
  }
}
