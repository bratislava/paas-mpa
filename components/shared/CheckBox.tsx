import RNCheckBox, { CheckBoxProps as RNCheckBoxProps } from '@react-native-community/checkbox'
import React from 'react'

import colors from '@/tailwind.config.colors'

// Docs: https://github.com/react-native-checkbox/react-native-checkbox#props
export type CheckBoxProps = Pick<RNCheckBoxProps, 'value' | 'onValueChange' | 'disabled'>

const CheckBox = ({ ...rest }: CheckBoxProps) => {
  // eslint-disable-next-line const-case/uppercase
  const GREEN = colors.green.DEFAULT

  return (
    <RNCheckBox
      // android props
      tintColors={{ true: GREEN, false: GREEN }}
      // ios props
      boxType="square"
      lineWidth={2.5} // it is scaled to 2
      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      tintColor={GREEN}
      onCheckColor="white"
      onFillColor={GREEN}
      onTintColor={GREEN}
      onAnimationType="bounce"
      offAnimationType="bounce"
      animationDuration={0.2}
      {...rest}
    />
  )
}

export default CheckBox
