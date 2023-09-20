/* eslint-disable @typescript-eslint/no-unused-vars */
import { Auth } from 'aws-amplify'
import React, { useState } from 'react'
import { GENERIC_ERROR_MESSAGE, isError, isErrorWithCode } from 'utils/errors'

import Typography from '@/components/shared/Typography'

// eslint-disable-next-line const-case/uppercase
const staticTempPass = 'a0808cc6-5345-49f6-a7e7-c129df4adc5a'

const LoginConfirmScreen = () => {
  const [loginError, setLoginError] = useState<Error | null>(null)
  // fix types once aws-amplify fixes them
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-redundant-type-constituents
  const [loginResult, setLoginResult] = useState</* Auth.SignInResult */ any | null>(null)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')

  const confirmStep = async () => {
    try {
      // eslint-disable-next-line unicorn/prefer-ternary
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
        const loginResultInner = await Auth.signIn(email, password)
        if (loginResultInner) {
          // TODO confirm login
          await Auth.confirmSignIn(loginResultInner, 'todocode')
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
  // eslint-disable-next-line pii/no-phone-number
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
  return <Typography>TODO</Typography>
}

export default LoginConfirmScreen
