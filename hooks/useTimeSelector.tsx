import { useState } from 'react'

export const useTimeSelector = (defaultValue: number) => {
  const [value, setValue] = useState<number>(defaultValue)

  return {
    timeValue: value,
    setTimeValue: setValue,
  }
}
