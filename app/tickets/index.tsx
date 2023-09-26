import React from 'react'

import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

// TODO
const Page = () => {
  const t = useTranslation('Tickets')

  return (
    <ScreenView title={t('title')}>
      <ScreenContent>
        <Typography variant="h1">TODO</Typography>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
