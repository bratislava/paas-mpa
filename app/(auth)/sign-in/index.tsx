import * as Sentry from '@sentry/react-native'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'

import countries from '@/components/controls/country-select/countries.json'
import CountrySelectField from '@/components/controls/country-select/CountrySelectField'
import { useUsedCountryStorage } from '@/components/controls/country-select/useUsedCountryStorage'
import Captcha from '@/components/inputs/Captcha'
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
  const { t } = useTranslation()
  const { attemptSignInOrSignUp } = useSignInOrSignUp()
  const [isOnboardingFinished] = useIsOnboardingFinished()
  const [isCaptchaShown, setIsCaptchaShown] = useState(false)

  const translationKeys: Record<string, string> = {
    CodeMismatchException: t('Auth.errors.CodeMismatchException'),
    Error: t('Auth.errors.Error'),
    InvalidParameterException: t('Auth.errors.InvalidParameterException'),
    NotAuthorizedException: t('Auth.errors.NotAuthorizedException'),
    TurnstileCaptchaFailed: t('Auth.errors.TurnstileCaptchaFailed'),
  }

  const [selectedCountry, setSelectedCountry] = useUsedCountryStorage()

  useEffect(() => {
    if (!selectedCountry) {
      setSelectedCountry('SK')
    }
  }, [selectedCountry, setSelectedCountry])

  const prefixCode =
    countries.find((country) => country.iso === selectedCountry?.toUpperCase())?.code || '421'

  const [loading, setLoading] = useState(false)
  const [expectedError, setExpectedError] = useState('')
  const [phone, setPhone] = useState('')
  const [isCaptchaRetry, setIsCaptchaRetry] = useState(false)

  const handleInputFocus = () => {
    if (expectedError) {
      setExpectedError('')
    }
  }

  const phoneWithoutSpaces = `+${prefixCode}${phone}`.replaceAll(/\s/g, '')

  const handleRequestCaptcha = () => {
    setLoading(true)
    setIsCaptchaShown(true)
  }

  const handleSignIn = async (token: string, captchaErrorCode?: string) => {
    try {
      // TODO This never happens because `phoneWithoutSpaces` always contains at least "+" symbol
      if (!phoneWithoutSpaces) {
        throw new Error('No phone number')
      }

      await attemptSignInOrSignUp(phoneWithoutSpaces, token, captchaErrorCode)
    } catch (error) {
      // Expected errors are in SIGNIN_ERROR_CODES_TO_SHOW
      if (isErrorWithName(error)) {
        setExpectedError(error.name)
      }
    }

    setLoading(false)
  }

  const handleChangeText = (value: string) => {
    if (expectedError) {
      setExpectedError('')
    }
    // TODO this works only when user pastes the whole number from clipboard, and only if it contains a space after the country code
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
    } else if (value.startsWith('09')) {
      // If the value starts with "09", remove the first character (0)
      setPhone(value.slice(1))
    } else {
      setPhone(value)
    }
  }

  const handleCaptchaFail = (errorCode: string) => {
    // The second stage of captcha integration includes the error message and signing in after the second try even when the captcha fails
    if (isCaptchaRetry) {
      setIsCaptchaRetry(false)
      Sentry.captureException('Turnstile Captcha failed twice', {
        extra: { errorCode },
        level: 'info',
      })

      // For now we call the signIn function even if the captcha fails to get data from lambda...
      // TODO: remove after 100% sure that the captcha is working
      handleSignIn('', errorCode)
    } else {
      setExpectedError('TurnstileCaptchaFailed')
      setIsCaptchaRetry(true)
      setLoading(false)
    }
    setIsCaptchaShown(false)
  }

  return (
    <DismissKeyboard>
      <ScreenView hasBackButton={!isOnboardingFinished}>
        <ScrollView alwaysBounceVertical={false}>
          <ScreenContent>
            <Typography variant="h1">{t('Auth.enterPhoneNumber')}</Typography>

            <View className="g-1">
              {/* Note that `onSubmitEditing` on iOS isn't called when using keyboardType="phone-pad": https://reactnative.dev/docs/textinput#onsubmitediting */}
              {/* Adding returnKeyType="done" adds Done button above keyboard, otherwise, there is no "Enter" button */}
              <FlexRow className="g-2.5">
                <CountrySelectField selectedCountry={selectedCountry} />

                <TextInput
                  leftIcon={<Typography>+{prefixCode}</Typography>}
                  viewClassName="flex-1"
                  value={phone}
                  onChangeText={handleChangeText}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  hasError={!!expectedError}
                  onFocus={handleInputFocus}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleRequestCaptcha}
                />
              </FlexRow>

              {expectedError ? (
                <Typography className="text-negative">{translationKeys[expectedError]}</Typography>
              ) : null}
            </View>

            {isCaptchaShown ? (
              <Captcha onSuccess={handleSignIn} onFail={handleCaptchaFail} />
            ) : null}

            <Markdown>{t('Auth.consent')}</Markdown>

            <ContinueButton
              loading={loading}
              disabled={!phoneWithoutSpaces}
              onPress={handleRequestCaptcha}
            />
          </ScreenContent>
        </ScrollView>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default Page
