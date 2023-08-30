import { Text } from '@rneui/themed'
import { Auth } from 'aws-amplify'
import React, { useState } from 'react'
import { GENERIC_ERROR_MESSAGE, isError, isErrorWithCode } from 'utils/errors'

const staticTempPass = 'a0808cc6-5345-49f6-a7e7-c129df4adc5a'

const LoginConfirmScreen = () => {
  const [loginError, setLoginError] = useState<Error | null>(null)
  const [loginResult, setLoginResult] = useState<Auth.SignInResult | null>(null)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')

  const confirmStep = async () => {
    try {
      if (loginResult) {
        await Auth.confirmSignIn(loginResult, code)
      } else {
        // this is a signUp operation
        await Auth.confirmSignUp(phone, code)
      }
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

  const attemptLogin = async (email: string, password: string) => {
    try {
      try {
        const loginResult = await Auth.signIn(email, password)
        if (loginResult) {
          // TODO confirm login
          await Auth.confirmSignIn(loginResult, 'todocode')
        }
      } catch (error) {
        console.log(error)
        // TODO
        await Auth.signUp({
          username: '+421948234641',
          password: staticTempPass,
          autoSignIn: {
            enabled: true,
          },
        })
        if (isError(error)) {
          setLoginError(error)
          if (isErrorWithCode(error) && error.code === 'UserNotConfirmedException') {
            // TODO regular register flow
            // TODO continue here - move one higher and complete signUp, use state
          }
        } else {
          throw error
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

  // useEffect(() => {
  //   ;(async () => {
  //     console.log('hello')
  //     console.log(Crypto.randomUUID())
  //     await Auth.signUp({
  //       username: '+421948234641',
  //       password: staticTempPass,
  //       autoSignIn: {
  //         enabled: true,
  //       },
  //     })
  //   })()
  //     .then(() => console.log('done'))
  //     .catch(console.log)
  // }, [])
  return <Text>TODO</Text>
}

export default LoginConfirmScreen
