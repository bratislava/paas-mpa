import clsx from 'clsx'
import React from 'react'
import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native'

type Props = RNSwitchProps

/*
 * Docs: https://reactnative.dev/docs/switch
 *
 * Figma component: https://www.figma.com/file/17wbd0MDQcMW9NbXl6UPs8/DS-ESBS%2BBK%3A-Component-library?node-id=12%3A433&mode=dev
 * Figma usage in PAAS MPA: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=486%3A2961&mode=dev
 *
 */

// TODO styling, omit props, potentially replace by https://www.npmjs.com/package/react-native-switch
const Switch = ({ ...props }: Props) => {
  return <RNSwitch className={clsx(props.disabled && 'opacity-50')} {...props} />
}

export default Switch
