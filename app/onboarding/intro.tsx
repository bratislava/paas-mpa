import Screen from '@/components/shared/Screen'
import ScreenContent from '@/components/shared/ScreenContent'
import Typography from '@/components/shared/Typography'

const Page = () => {
  return (
    <Screen>
      <ScreenContent continueProps={{ href: '/onboarding/enter-phone-number' }}>
        <Typography>Intro</Typography>
      </ScreenContent>
    </Screen>
  )
}

export default Page
