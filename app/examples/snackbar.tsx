import Button from '@/components/shared/Button'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useSnackbar } from '@/hooks/useSnackbar'

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
