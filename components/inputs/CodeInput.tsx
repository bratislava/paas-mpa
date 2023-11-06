import clsx from 'clsx'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'

import Typography from '@/components/shared/Typography'

const CELL_COUNT = 6

const styles = StyleSheet.create({
  rootStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

const CodeInput = () => {
  const [value, setValue] = useState('')

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })

  return (
    <CodeField
      ref={ref}
      {...props}
      // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
      value={value}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      rootStyle={styles.rootStyle}
      renderCell={({ index, symbol, isFocused }) => (
        <Typography
          key={index}
          onLayout={getCellOnLayoutHandler(index)}
          className={clsx(
            'h-[48px] w-[48px] items-center justify-center rounded border border-divider bg-white text-center text-[20px] leading-[44px]',
            {
              'border-dark': isFocused,
            },
          )}
        >
          {symbol || (isFocused ? <Cursor /> : null)}
        </Typography>
      )}
    />
  )
}

export default CodeInput
