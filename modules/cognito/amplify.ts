/* eslint-disable import/no-extraneous-dependencies */
// @aws-amplify/auth & @aws-amplify/core are part of aws-amplify & safe enough to import here like this
// this import fixes issues with Jest not being able to parse esm lib imported in the root of aws-amplify
import { Amplify } from 'aws-amplify'

import { environment } from '@/environment'

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: environment.awsRegion,

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: environment.cognitoUserPoolId,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: environment.cognitoClientId,

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    // mandatorySignIn: false,

    // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
    // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
    signUpVerificationMethod: 'code',
  },
})