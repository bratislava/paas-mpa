import { ReactNode } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

type Props = {
  children: ReactNode
}

/**
 * Input helper component to dismiss Keyboard on click outside input
 * https://webcache.googleusercontent.com/search?q=cache:https://akshay-s-somkuwar.medium.com/dismiss-hide-keyboard-on-tap-outside-of-textinput-react-native-b94016f35ff0
 */
const DismissKeyboard = ({ children }: Props) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>{children}</TouchableWithoutFeedback>
)

export default DismissKeyboard
