import { router } from 'expo-router'
import { Pressable, View } from 'react-native'
import CountryFlag from 'react-native-country-flag'

import Icon from '@/components/shared/Icon'

type Props = {
  selectedCountry?: string
}

/**
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=8638%3A7152&mode=dev
 */

const CountryeSelectField = ({ selectedCountry = 'SK' }: Props) => {
  return (
    <Pressable
      onPress={() => router.push('/sign-in/flag-search')}
      className="w-[88px] flex-row items-center rounded border border-divider bg-white px-4 py-3 g-3 active:border-dark"
    >
      <View className="h-6 w-6 items-center justify-center overflow-hidden rounded-full">
        <CountryFlag isoCode={selectedCountry} size={24} />
      </View>

      <Icon name="expand-more" />
    </Pressable>
  )
}

export default CountryeSelectField
