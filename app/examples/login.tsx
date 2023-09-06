import { Button, Input, Text } from '@rneui/themed'
import { Auth } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { GENERIC_ERROR_MESSAGE, isError, isErrorWithCode } from 'utils/errors'

// eslint-disable-next-line const-case/uppercase
const staticTempPass = 'a0808cc6-5345-49f6-a7e7-c129df4adc5a'

const LoginScreen = () => {
  const [phoneToConfirm, setPhoneToConfirm] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<Error | null>(null)
  // fix types once aws-amplify fixes them
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-redundant-type-constituents
  const [loginResult, setLoginResult] = useState</* Auth.SignInResult */ any | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-redundant-type-constituents
  const [signUpResult, setSignUpResult] = useState</* Auth.SignUpResult */ any | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [authResult, setAuthResult] = useState<any>(null)
  // eslint-disable-next-line pii/no-phone-number
  const [phone, setPhone] = useState('+421948234641')
  const [code, setCode] = useState('')

  const confirmStep = async () => {
    try {
      // eslint-disable-next-line unicorn/prefer-ternary
      if (loginResult) {
        await Auth.confirmSignIn(loginResult, code)
      } else {
        // this is a signUp operation
        await Auth.confirmSignUp(phoneToConfirm || phone, code)
      }
      setAuthResult(Auth.currentUserInfo())
    } catch (error) {
      if (isError(error)) {
        setLoginError(error)
      } else {
        console.error(
          `${GENERIC_ERROR_MESSAGE} - unexpected object thrown in onVerifyEmail:`,
          error,
        )
        setLoginError(new Error(GENERIC_ERROR_MESSAGE))
      }
    }
  }

  const attemptLogin = async () => {
    try {
      try {
        const loginResultInner = await Auth.signIn(phone, staticTempPass)
        if (loginResultInner) {
          setLoginResult(loginResultInner)
        }
      } catch (error) {
        if (isError(error)) {
          setLoginError(error)
          if (isErrorWithCode(error) && error.code === 'UserNotConfirmedException') {
            // TODO @mpinter investigate autoSignIn after resendSignUp
            await Auth.resendSignUp(phone)
            setPhoneToConfirm(phone)
            // TODO navigate
          }
        } else {
          // TODO @mpinter only sing up on some errors, not on all, throw the rest
          const signUpResultInner = await Auth.signUp({
            username: phone,
            password: staticTempPass,
            autoSignIn: {
              enabled: true,
            },
          })
          setSignUpResult(signUpResultInner)
          // TODO navigate
        }
      }
    } catch (error) {
      if (isError(error)) {
        setLoginError(error)
      } else {
        console.error(`${GENERIC_ERROR_MESSAGE} - unexpected object thrown in signUp:`, error)
        setLoginError(new Error(GENERIC_ERROR_MESSAGE))
      }
    }
  }

  useEffect(() => {
    ;(async () => {
      setAuthResult(await Auth.currentUserInfo())
    })()
      .then(() => console.log('done'))
      .catch(console.log)
  }, [])
  return (
    <ScrollView>
      <View style={styles.container}>
        <Input placeholder="Phone" value={phone} onChangeText={setPhone} />
        <Input placeholder="Code" value={code} onChangeText={setCode} />
        <Text>{loginError?.message || JSON.stringify(loginResult)}</Text>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button onPress={() => attemptLogin()} title="Login/Register" />
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button onPress={confirmStep} title="Confirm" />
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button onPress={() => Auth.signOut()} title="Logout" />
        <Text>{phoneToConfirm}</Text>
        <Text>{JSON.stringify(authResult)}</Text>
        <Text>{JSON.stringify(loginResult)}</Text>
        <Text>{JSON.stringify(signUpResult)}</Text>
      </View>
    </ScrollView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
  },
})