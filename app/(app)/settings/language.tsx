import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, View } from 'react-native'

import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation as useTranslationLocal } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { settingsOptions } from '@/modules/backend/constants/queryOptions'
import { SaveUserSettingsDto } from '@/modules/backend/openapi-generated'

const Page = () => {
  const t = useTranslationLocal('Settings')
  const { i18n } = useTranslation()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (body: SaveUserSettingsDto) => clientApi.usersControllerSaveUserSettings(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsOptions().queryKey })
    },
  })

  const { data, isPending } = useQueryWithFocusRefetch(settingsOptions())

  const language = data?.data?.language

  const handleLanguageChange = async (newLanguage: 'sk' | 'en') => {
    await i18n.changeLanguage(newLanguage)
    await mutation.mutateAsync({ language: newLanguage })

    if (router.canGoBack()) {
      router.back()
    }
  }

  const languages = [
    { label: 'Slovenčina', value: 'sk' },
    { label: 'English', value: 'en' },
  ] as const

  return (
    <ScreenView title={t('title')} hasBackButton>
      <ScreenContent>
        <View className="divide-y divide-divider">
          {languages.map(({ label, value }) => {
            return (
              <PressableStyled
                key={value}
                disabled={isPending || mutation.isPending}
                onPress={() => handleLanguageChange(value)}
                className="py-4"
              >
                <FlexRow>
                  <Typography>{label}</Typography>
                  {language === value ? (
                    <Icon name="check-circle" />
                  ) : mutation.isPending ? (
                    <ActivityIndicator size="small" />
                  ) : null}
                </FlexRow>
              </PressableStyled>
            )
          })}
        </View>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
