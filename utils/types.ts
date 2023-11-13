import { StyleProp, ViewStyle } from 'react-native'

export type ViewStyleProps = {
  style?: StyleProp<ViewStyle> | undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never
