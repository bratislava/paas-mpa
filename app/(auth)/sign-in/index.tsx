import { useEffect, useState } from 'react'
import { View } from 'react-native'

import countries from '@/components/controls/country-select/countries.json'
import CountryeSelectField from '@/components/controls/country-select/CountrySelectField'
import { useUsedCountryStorage } from '@/components/controls/country-select/useUsedCountryStorage'
import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import FlexRow from '@/components/shared/FlexRow'
import Markdown from '@/components/shared/Markdown'
import Typography from '@/components/shared/Typography'
import { useIsOnboardingFinished } from '@/hooks/useIsOnboardingFinished'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'
import { isErrorWithName } from '@/utils/errorCognitoAuth'

const Page = () => {
  const t = useTranslation('Auth')
  const { attemptSignInOrSignUp } = useSignInOrSignUp()
  const [isOnboardingFinished] = useIsOnboardingFinished()

  const [selectedCountry, setSelectedCountry] = useUsedCountryStorage()

  useEffect(() => {
    if (selectedCountry) return

    setSelectedCountry('SK')
  }, [selectedCountry, setSelectedCountry])

  const prefixCode =
    countries.find((country) => country.iso === selectedCountry?.toUpperCase())?.code || '421'

  const [loading, setLoading] = useState(false)
  const [errorCode, setErrorCode] = useState('')
  const [phone, setPhone] = useState('')

  const handleInputFocus = () => {
    if (errorCode) {
      setErrorCode('')
    }
  }

  const phoneWithoutSpaces = `+${prefixCode}${phone}`.replaceAll(/\s/g, '')

  const handleSignIn = async () => {
    try {
      setLoading(true)
      if (!phoneWithoutSpaces) {
        throw new Error('No phone number')
      }

      await attemptSignInOrSignUp(phoneWithoutSpaces)
    } catch (error) {
      if (isErrorWithName(error)) {
        setErrorCode(error.name)
      }
    }

    setLoading(false)
  }

  const handleChangeText = (value: string) => {
    if (errorCode) {
      setErrorCode('')
    }

    // Check if user pasted a phone number with country code and replace country code if it differs from the selected one
    if (value.length - phone.length > 1 && value.startsWith('+')) {
      let countryCode = prefixCode

      const valuePrefix = value.split(' ')[0]
      const valuePrefixCode = valuePrefix.replace('+', '')

      if (valuePrefix.startsWith('+') && valuePrefixCode && valuePrefixCode !== prefixCode) {
        const newCountry = countries.find((country) => country.code === valuePrefixCode)

        if (newCountry) {
          setSelectedCountry(newCountry.iso)
          countryCode = newCountry.code
        }
      }

      setPhone(value.replace(`+${countryCode}`, ''))
    } else setPhone(value)
  }

  return (
    <DismissKeyboard>
      <ScreenView hasBackButton={!isOnboardingFinished}>
        <ScreenContent>
          <Typography variant="h1">{t('enterPhoneNumber')}</Typography>

          <View className="g-1">
            {/* Note that `onSubmitEditing` on iOS isn't called when using keyboardType="phone-pad": https://reactnative.dev/docs/textinput#onsubmitediting */}
            {/* Adding returnKeyType="done" adds Done button above keyboard, otherwise, there is no "Enter" button */}
            <FlexRow className="g-2.5">
              <CountryeSelectField selectedCountry={selectedCountry} />

              <View className="flex-1">
                <TextInput
                  leftIcon={<Typography>+{prefixCode}</Typography>}
                  className="w-full"
                  viewClassName="g-2"
                  value={phone}
                  onChangeText={handleChangeText}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  hasError={!!errorCode}
                  onFocus={handleInputFocus}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                />
              </View>
            </FlexRow>

            {errorCode ? (
              <Typography className="text-negative">{t(`errors.${errorCode}`)}</Typography>
            ) : null}
          </View>

          <Markdown>{t('consent')}</Markdown>

          <ContinueButton loading={loading} disabled={!phoneWithoutSpaces} onPress={handleSignIn} />
        </ScreenContent>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default Page
