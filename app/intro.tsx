import { Link } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'

const Page = () => {
  return (
    <ScreenView>
      <ScreenContent>
        <Typography>Intro</Typography>
        <Link asChild href="/auth">
          <ContinueButton />
        </Link>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
