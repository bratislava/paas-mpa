import { ReactNode } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

type Props = {
  children: ReactNode
}

/**
 * Input helper component to dismiss Keyboard on click outside input
 * https://webcache.googleusercontent.com/search?q=cache:https://akshay-s-somkuwar.medium.com/dismiss-hide-keyboard-on-tap-outside-of-textinput-react-native-b94016f35ff0
 * Cannot be used with ScrollView, scrollView has separate prop for this keyboardDismissMode="on-drag"
 */
const DismissKeyboard = ({ children }: Props) => (
  <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
    {children}
  </TouchableWithoutFeedback>
)

export default DismissKeyboard
