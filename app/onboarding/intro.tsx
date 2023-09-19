import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'

const Page = () => {
  return (
    <ScreenView>
      <ScreenContent continueProps={{ href: '/onboarding/enter-phone-number' }}>
        <Typography>Intro</Typography>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
