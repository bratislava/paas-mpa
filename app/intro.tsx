import { Link } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'

const Page = () => {
  return (
    <ScreenView>
      <ScreenContent>
        <Typography>Intro</Typography>
        <Link asChild href="/sign-in">
          <ContinueButton />
        </Link>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
