/* eslint-disable import/no-extraneous-dependencies */
// @aws-amplify/auth & @aws-amplify/core are part of aws-amplify & safe enough to import here like this
// this import fixes issues with Jest not being able to parse esm lib imported in the root of aws-amplify
import { Amplify, Auth } from 'aws-amplify'
import { environment } from 'environment'

// TODO once env handling is merged update not to use process.env directly
Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: environment.awsRegion,

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: environment.cognitoUserPoolId,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: environment.cognitoClientId,

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
    // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
    signUpVerificationMethod: 'code',
  },
})

export const getAccessTokenOrLogout = async () => {
  try {
    const session = await Auth.currentSession()
    const jwtToken = session.getAccessToken().getJwtToken()
    if (!jwtToken) throw new Error('no jwt token found in current session')
    return jwtToken
  } catch (error) {
    console.error('error getting access token - redirect to login', error)
    // TODO redirect
    throw error
  }
}

// Auth.getCurrentAuthenticatedUser throws when not authenticated
// this helper changes that and ignores any other potential errors
export const getCurrentAuthenticatedUser = async () => {
  try {
    // TODO should be solved in v6 release of aws-amplify
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await Auth.currentAuthenticatedUser()
  } catch (error) {
    return null
  }
}