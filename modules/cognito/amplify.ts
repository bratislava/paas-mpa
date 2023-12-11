/* eslint-disable import/no-extraneous-dependencies */
// @aws-amplify/auth & @aws-amplify/core are part of aws-amplify & safe enough to import here like this
// this import fixes issues with Jest not being able to parse esm lib imported in the root of aws-amplify
import { Amplify } from 'aws-amplify'

import { environment } from '@/environment'

export const STATIC_TEMP_PASS = '66febdf7-5b71-4c32-9272-b9d9dd703a60'

/*
 * See type `CognitoUserPoolConfig` here: https://github.com/aws-amplify/amplify-js/blob/main/packages/core/src/singleton/Auth/types.ts#L144
 */

Amplify.configure({
  Auth: {
    Cognito: {
      // region is not used in v6

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: environment.cognitoUserPoolId,

      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: environment.cognitoClientId,

      // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
      // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
      // signUpVerificationMethod: 'code',
    },
  },
})
