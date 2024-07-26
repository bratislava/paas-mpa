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

/**
 * Permission status used with notifications
 */
export enum UnifiedPermissionStatus {
  /**
   * User has granted the permission.
   */
  GRANTED = 'granted',
  /**
   * User hasn't granted or denied the permission yet.
   */
  UNDETERMINED = 'undetermined',
  /**
   * User has denied the permission.
   */
  DENIED = 'denied',
}
