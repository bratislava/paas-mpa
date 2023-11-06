import CodeInput from '@/components/inputs/CodeInput'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'

const CodeInputScreen = () => {
  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">CodeInput</Typography>
        <CodeInput />
      </ScreenContent>
    </ScreenView>
  )
}

export default CodeInputScreen
