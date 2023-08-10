import { Text, Input, Button } from '@rneui/themed'
import { Auth } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { GENERIC_ERROR_MESSAGE, isError, isErrorWithCode } from 'utils/errors'

const staticTempPass = 'a0808cc6-5345-49f6-a7e7-c129df4adc5a'

const LoginScreen = () => {
  const [phoneToConfirm, setPhoneToConfirm] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<Error | null>(null)
  const [loginResult, setLoginResult] = useState<Auth.SignInResult | null>(null)
  const [signUpResult, setSignUpResult] = useState<Auth.SignUpResult | null>(null)
  const [authResult, setAuthResult] = useState<any>(null)
  const [phone, setPhone] = useState('+421948234641')
  const [code, setCode] = useState('')

  const confirmStep = async () => {
    try {
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
        const loginResult = await Auth.signIn(phone, staticTempPass)
        if (loginResult) {
          setLoginResult(loginResult)
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
          const signUpResult = await Auth.signUp({
            username: phone,
            password: staticTempPass,
            autoSignIn: {
              enabled: true,
            },
          })
          setSignUpResult(signUpResult)
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
        <Button onPress={() => attemptLogin()}>Login/Register</Button>
        <Button onPress={confirmStep}>Confirm</Button>
        <Button onPress={() => Auth.signOut()}>Logout</Button>
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
