import { Auth } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { GENERIC_ERROR_MESSAGE, isError, isErrorWithCode } from 'utils/errors'

import TextInput from '@/components/inputs/TextInput'
import Button from '@/components/shared/Button'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { STATIC_TEMP_PASS } from '@/modules/cognito/amplify'

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
  const [phone, setPhone] = useState('+421')
  const [code, setCode] = useState('')

  const confirmStep = async () => {
    try {
      // eslint-disable-next-line unicorn/prefer-ternary
      if (loginResult) {
        console.log('attempting to confirm sign in')
        await Auth.confirmSignIn(loginResult, code)
      } else {
        // this is a signUp operation
        console.log(
          'attempting to confirm sign up with phone',
          phoneToConfirm || phone,
          'and code',
          code,
        )
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
        const loginResultInner = await Auth.signIn(phone, STATIC_TEMP_PASS)
        console.log('loginResultInner:\n', JSON.stringify(loginResultInner, undefined, 2))
        if (loginResultInner) {
          setLoginResult(loginResultInner)
        }
      } catch (error) {
        if (
          isError(error) &&
          isErrorWithCode(error) &&
          error.code === 'UserNotConfirmedException'
        ) {
          setLoginError(error)
          console.log('UserNotConfirmedException')
          // TODO @mpinter investigate autoSignIn after resendSignUp
          await Auth.resendSignUp(phone)
          setPhoneToConfirm(phone)
          // TODO navigate
        } else {
          console.log('Other errors - TODO chose which to handle and which to throw.')
          // TODO @mpinter only sing up on some errors, not on all, throw the rest
          const signUpResultInner = await Auth.signUp({
            username: phone,
            password: STATIC_TEMP_PASS,
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

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const signOut = () => {
    return Auth.signOut()
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const getToken = async () => {
    try {
      const tok = await Auth.currentSession()
      if (tok) {
        console.log(tok.getAccessToken())
      } else {
        console.log('no token')
      }
    } catch (error) {
      console.error('getToken error:', error)
    }
  }

  useEffect(() => {
    ;(async () => {
      const currentUser = await Auth.currentSession()
      console.log('currentUser:', currentUser)
      setAuthResult(currentUser)
    })()
      .then(() => console.log('done'))
      .catch((error) => console.log('No user:', error))
  }, [])

  return (
    <ScreenView>
      <ScrollView>
        <ScreenContent>
          <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} />
          <TextInput placeholder="Code" value={code} onChangeText={setCode} />
          <Typography>Login error message: {loginError?.message}</Typography>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button onPress={attemptLogin}>Login/Register</Button>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button onPress={confirmStep}>Confirm</Button>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button onPress={signOut}>Logout</Button>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button onPress={getToken}>Token</Button>
          {phoneToConfirm ? <Typography>{phoneToConfirm}</Typography> : null}
          <Typography>Auth result: {JSON.stringify(authResult, undefined, 2)}</Typography>
          <Typography>Login result: {JSON.stringify(loginResult, undefined, 2)}</Typography>
          <Typography>Signup result: {JSON.stringify(signUpResult, undefined, 2)}</Typography>
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default LoginScreen
