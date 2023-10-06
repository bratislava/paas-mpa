import { Link } from 'expo-router'
import React from 'react'

import LanguageSelect from '@/components/controls/LanguageSelect'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation as useTranslationLocal } from '@/hooks/useTranslation'

// TODO
const Page = () => {
  const t = useTranslationLocal('Settings')

  return (
    <ScreenView title={t('title')}>
      <ScreenContent>
        <Field label={t('language')}>
          <Link asChild href="/settings/language">
            <PressableStyled>
              <LanguageSelect />
            </PressableStyled>
          </Link>
        </Field>
        <Typography variant="h1">TODO</Typography>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
