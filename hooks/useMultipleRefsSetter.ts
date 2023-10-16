import { ForwardedRef, MutableRefObject, RefCallback, useMemo } from 'react'

/** A hook for when multiple refs have to be bound to a single element, as in the case of `forwardRef`
 * which cannot be used inside the component itself and another local ref has to be created. */
export const useMultipleRefsSetter = <N>(
  ...refs: (RefCallback<N> | MutableRefObject<N> | ForwardedRef<N>)[]
) => {
  return useMemo(
    () => (node: N) => {
      refs.forEach((passedRef) => {
        if (typeof passedRef === 'function') {
          passedRef(node)
        } else if (passedRef) {
          // eslint-disable-next-line no-param-reassign
          passedRef.current = node
        }
      })
    },
    [refs],
  )
}
