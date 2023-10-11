import { ForwardedRef, MutableRefObject, RefCallback } from 'react'

export const getMultipleRefsSetter =
  <O>(...args: (RefCallback<O> | MutableRefObject<O> | ForwardedRef<O>)[]) =>
  (node: O) => {
    args.forEach((passedRef) => {
      if (typeof passedRef === 'function') {
        passedRef(node)
      } else if (passedRef) {
        // eslint-disable-next-line no-param-reassign
        passedRef.current = node
      }
    })
  }
