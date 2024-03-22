import { MaterialIcons } from '@expo/vector-icons'
import { ComponentProps } from 'react'

export type IconName = ComponentProps<typeof MaterialIcons>['name']

type Props = {
  name: IconName
} & Omit<ComponentProps<typeof MaterialIcons>, 'name' | 'onPress'>

const Icon = ({ name, size = 24, ...rest }: Props) => {
  return <MaterialIcons maxFontSizeMultiplier={1.2} name={name} size={size} {...rest} />
}

export default Icon
