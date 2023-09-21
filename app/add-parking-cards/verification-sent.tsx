import { useLocalSearchParams } from 'expo-router'
import React from 'react'

import AvatarCircle from '@/components/info/AvatarCircle'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

/*
 * TODO
 * - [ ] add nextHref page after verification email is sent
 *
 * figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-(mobile-app)-%5BWIP%5D?node-id=4232%3A6109&mode=dev
 */
const Page = () => {
  const t = useTranslation('AddParkingCards')
  const { emailToVerify } = useLocalSearchParams()

  return (
    // TODO add dynamic href
    <ScreenView variant="centered" backgroundVariant="dots" continueProps={{ href: '/' }}>
      <ScreenContent variant="center">
        {/* TODO replace by icon */}
        <AvatarCircle variant="info" />
        <Typography variant="h1">{t('verifyYourEmail')}</Typography>

        <Typography>{t('verifyYourEmailInfo', { email: emailToVerify })}</Typography>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
