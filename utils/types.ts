import { StyleProp, ViewStyle } from 'react-native'

export type ViewStyleProps = {
  style?: StyleProp<ViewStyle> | undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never

/**
 * Make a subtype of type required
 * @example type Foo = { a?: string; b?: string }
 *          type Bar = WithRequired<Foo, 'a'>
 *          // Bar is { a: string; b?: string }
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
