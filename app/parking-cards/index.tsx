import { Link } from 'expo-router'
import React from 'react'

import Button from '@/components/shared/Button'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

// TODO
const Page = () => {
  const t = useTranslation('ParkingCards')

  return (
    <ScreenView title={t('title')}>
      <ScreenContent>
        <Typography variant="h1">TODO</Typography>
        <Link asChild href="/parking-cards/enter-paas-account">
          <Button>{t('addParkingCards')}</Button>
        </Link>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
