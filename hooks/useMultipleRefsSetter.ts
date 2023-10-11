import { ForwardedRef, MutableRefObject, RefCallback, useMemo } from 'react'

import { getMultipleRefsSetter } from '@/utils/getMultipleRefsSetter'

export const useMultipleRefsSetter = <O>(
  ...args: (RefCallback<O> | MutableRefObject<O> | ForwardedRef<O>)[]
) => {
  return useMemo(() => getMultipleRefsSetter(...args), [args])
}
