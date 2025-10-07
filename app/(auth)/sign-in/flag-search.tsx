import { ListRenderItem } from '@shopify/flash-list'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'
import { View } from 'react-native'
import CountryFlag from 'react-native-country-flag'

import countries from '@/components/controls/country-select/countries.json'
import { useUsedCountryStorage } from '@/components/controls/country-select/useUsedCountryStorage'
import TextInput from '@/components/inputs/TextInput'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import FlexRow from '@/components/shared/FlexRow'
import { List } from '@/components/shared/List/List'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

type Country = {
  name: string
  nativeName: string
  iso: string
  code: string
}

const CountrySearchScreen = () => {
  const { t } = useTranslation()
  const [searchedCountry, setSearchedCountry] = useState('')

  const [, setSelectedCountry] = useUsedCountryStorage()

  const handleCancel = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/sign-in')
    }
  }, [])

  const filteredCountries = countries.filter((country) => {
    return (
      country.iso.toLowerCase().includes(searchedCountry.toLowerCase()) ||
      country.nativeName.toLowerCase().includes(searchedCountry.toLowerCase()) ||
      country.name.toLowerCase().includes(searchedCountry.toLowerCase()) ||
      country.code.toLowerCase().includes(searchedCountry.toLowerCase())
    )
  })

  const handleChangeText = (value: string) => {
    setSearchedCountry(value)
  }

  const renderItem: ListRenderItem<Country> = useCallback(
    ({ item }) => {
      return (
        <PressableStyled
          onPress={() => {
            setSelectedCountry(item.iso)
            router.back()
          }}
          className="border-b border-divider py-4"
        >
          <FlexRow className="items-center g-3">
            <View className="p-1">
              <View className="h-4 w-4 items-center justify-center overflow-hidden rounded-full">
                <CountryFlag isoCode={item.iso} size={16} />
              </View>
            </View>

            <FlexRow className="flex-1 justify-start g-3">
              <Typography variant="default-bold">{item.nativeName}</Typography>
              <Typography>+{item.code}</Typography>
            </FlexRow>
          </FlexRow>
        </PressableStyled>
      )
    },
    [setSelectedCountry],
  )

  return (
    <DismissKeyboard>
      <ScreenView options={{ headerShown: false }}>
        <ScreenContent className="g-3">
          <View className="flex-1">
            <View>
              <FlexRow>
                <View className="flex-1">
                  <TextInput
                    placeholder={t('Common.search')}
                    className="w-full"
                    value={searchedCountry}
                    onChangeText={handleChangeText}
                    autoFocus
                    returnKeyType="done"
                  />
                </View>
                <Button variant="plain-dark" onPress={handleCancel}>
                  {t('Common.cancel')}
                </Button>
              </FlexRow>
            </View>

            <View className="mt-3 flex-1">
              <List data={filteredCountries} renderItem={renderItem} />
            </View>
          </View>
        </ScreenContent>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default CountrySearchScreen
