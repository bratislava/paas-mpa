import { useState } from 'react'

import CodeInput from '@/components/inputs/CodeInput'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'

const CodeInputScreen = () => {
  const [code, setCode] = useState('')

  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">CodeInput</Typography>
        <CodeInput value={code} setValue={setCode} onBlur={() => console.log('BLUR')} />
      </ScreenContent>
    </ScreenView>
  )
}

export default CodeInputScreen
