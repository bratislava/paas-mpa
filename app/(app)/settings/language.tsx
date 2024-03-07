import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, FlatList } from 'react-native'
import { useMMKVString } from 'react-native-mmkv'

import ActionRow from '@/components/list-rows/ActionRow'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import Icon from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation as useTranslationLocal } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { settingsOptions } from '@/modules/backend/constants/queryOptions'
import { SaveUserSettingsDto } from '@/modules/backend/openapi-generated'
import { STORAGE_LANGUAGE_KEY } from '@/utils/mmkv'

const Page = () => {
  const t = useTranslationLocal('Settings')
  const { i18n } = useTranslation()
  const queryClient = useQueryClient()
  const [, setMmkvLocale] = useMMKVString(STORAGE_LANGUAGE_KEY)

  const mutation = useMutation({
    mutationFn: (body: SaveUserSettingsDto) => clientApi.usersControllerSaveUserSettings(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsOptions().queryKey })
    },
  })

  const { data, isPending } = useQueryWithFocusRefetch(settingsOptions())

  const language = data?.data?.language

  const handleLanguageChange = async (newLanguage: 'sk' | 'en') => {
    if (newLanguage !== language) {
      await mutation.mutateAsync({ language: newLanguage })
      await i18n.changeLanguage(newLanguage)
      setMmkvLocale(newLanguage)
    }

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
        <FlatList
          ItemSeparatorComponent={() => <Divider />}
          data={languages}
          renderItem={({ item }) => (
            <PressableStyled
              key={item.value}
              disabled={isPending || mutation.isPending}
              onPress={() => handleLanguageChange(item.value)}
            >
              <ActionRow
                endSlot={
                  language === item.value ? (
                    <Icon name="check-circle" />
                  ) : mutation.isPending ? (
                    <ActivityIndicator size="small" />
                  ) : null
                }
                label={item.label}
              />
            </PressableStyled>
          )}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
