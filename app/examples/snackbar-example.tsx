import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'

const SnackbarScreen = () => {
  const { show } = useSnackbar()
  const openSnackbar = () =>
    show('Error message from snackbar screen example 🚀 This is a very long text', {
      variant: 'success',
    })

  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">Snackbar</Typography>
        <Button onPress={openSnackbar}>Open error snackbar</Button>
      </ScreenContent>
    </ScreenView>
  )
}

export default SnackbarScreen
