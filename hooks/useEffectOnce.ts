import { EffectCallback, useEffect } from 'react'

/**
 * useEffect that runs only at first render of a component
 * same as from library react-use
 */
export const useEffectOnce = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
