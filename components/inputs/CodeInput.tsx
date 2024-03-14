import { StyleSheet, View } from 'react-native'
import {
  CodeField,
  CodeFieldProps,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'

import Typography from '@/components/shared/Typography'
import { cn } from '@/utils/cn'

const styles = StyleSheet.create({
  rootStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

type CodeInputProps = Omit<
  CodeFieldProps,
  | 'renderCell'
  | 'rootStyle'
  | 'autoComplete'
  | 'keyboardType'
  | 'value'
  | 'onChangeText'
  | 'onSubmitEditing'
> & {
  value: string
  setValue: (value: string) => void
  error?: string
}
/**
 * Docs: https://github.com/retyui/react-native-confirmation-code-field/blob/c944750acb811d2cc7f2a45ae9e6982831297419/API.md
 *
 * Instead of `onSubmitEditing` use `onBlur` - field is automatically blured when fulfilled.
 *
 * @param cellCount
 * @param value
 * @param setValue
 * @param error string that will change border color to negative and show error message
 * @param props
 * @constructor
 */
const CodeInput = ({ cellCount = 6, value, setValue, error, ...props }: CodeInputProps) => {
  const ref = useBlurOnFulfill({ value, cellCount })
  const [focusCellProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })

  return (
    <View className="g-1">
      <CodeField
        ref={ref}
        {...props}
        {...focusCellProps}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={setValue}
        cellCount={cellCount}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        rootStyle={styles.rootStyle}
        renderCell={({ index, symbol, isFocused }) => (
          <Typography
            key={index}
            onLayout={getCellOnLayoutHandler(index)}
            // TODO - sizes are little bit guessed, needs to be tested on multiple devices
            className={cn(
              'h-[48px] w-[48px] items-center justify-center rounded border border-divider bg-white text-center text-[20px] leading-[44px]',
              {
                'border-dark': isFocused,
                'border-negative': !!error,
              },
            )}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Typography>
        )}
      />

      {error ? <Typography className="text-negative">{error}</Typography> : null}
    </View>
  )
}

export default CodeInput
