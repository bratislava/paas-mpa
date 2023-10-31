import { Link } from 'expo-router'
import React from 'react'
import { ScrollView } from 'react-native'

import LanguageSelect from '@/components/controls/LanguageSelect'
import NotificationSettings from '@/components/controls/notifications/NotificationSettings'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation as useTranslationLocal } from '@/hooks/useTranslation'

const SettingsPage = () => {
  const t = useTranslationLocal('Settings')

  return (
    <ScreenView title={t('title')}>
      <ScrollView>
        <ScreenContent>
          <Field label={t('language')}>
            <Link asChild href="/settings/language">
              <PressableStyled>
                <LanguageSelect />
              </PressableStyled>
            </Link>
          </Field>

          <NotificationSettings />
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default SettingsPage
