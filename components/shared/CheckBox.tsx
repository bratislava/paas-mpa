import clsx from 'clsx'
import React from 'react'

import Icon from './Icon'
import PressableStyled from './PressableStyled'

type Props = {
  value: boolean
  disabled?: boolean
  onChange: (newValue: boolean) => void
}

const Checkbox = ({ onChange, disabled, value }: Props) => {
  const handleToggle = () => {
    onChange(!value)
  }

  return (
    <PressableStyled
      className={clsx('h-8 w-8 items-center justify-center rounded-[4px] border-2 border-green', {
        'bg-green': value,
        'opacity-50': disabled,
      })}
      onPress={handleToggle}
      role="checkbox"
      disabled={disabled}
    >
      {value ? <Icon name="check" className="text-xl text-white" /> : null}
    </PressableStyled>
  )
}

export default Checkbox
