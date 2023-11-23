import { router } from 'expo-router'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useMMKVString } from 'react-native-mmkv'

import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation as useTranslationLocal } from '@/hooks/useTranslation'
import { storage, STORAGE_LANGUAGE_KEY } from '@/utils/mmkv'

// TODO
const Page = () => {
  const t = useTranslationLocal('Settings')
  const { i18n } = useTranslation()
  const [mmkvLocale, setMmkvLocale] = useMMKVString(STORAGE_LANGUAGE_KEY)

  const setLanguage = async (language: 'sk' | 'en') => {
    await i18n.changeLanguage(language)
    setMmkvLocale(language)

    if (router.canGoBack()) {
      router.back()
    }
  }

  const setSystemLanguage = () => {
    storage.delete(STORAGE_LANGUAGE_KEY)
    if (router.canGoBack()) {
      router.back()
    }
  }

  const languages = [
    { label: 'Slovenčina', value: 'sk' },
    { label: 'English', value: 'en' },
  ] as const

  return (
    <ScreenView title={t('title')}>
      <ScreenContent>
        <View>
          <PressableStyled onPress={setSystemLanguage} className="py-4">
            <FlexRow>
              <Typography>{t('system')}</Typography>
              {/* TODO fix check icon */}
              {mmkvLocale === undefined && <Icon name="check-circle" />}
            </FlexRow>
          </PressableStyled>
          {languages.map(({ label, value }) => {
            return (
              <Fragment key={value}>
                <Divider />
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <PressableStyled onPress={() => setLanguage(value)} className="py-4">
                  <FlexRow>
                    <Typography>{label}</Typography>
                    {mmkvLocale === value && <Icon name="check-circle" />}
                  </FlexRow>
                </PressableStyled>
              </Fragment>
            )
          })}
        </View>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
