import { Auth } from 'aws-amplify'
import { router } from 'expo-router'

export const getAccessTokenOrLogout = async () => {
  try {
    const session = await Auth.currentSession()
    const jwtToken = session.getAccessToken().getJwtToken()
    if (!jwtToken) {
      throw new Error('no jwt token found in current session')
    }

    return jwtToken
  } catch (error) {
    console.log('error getting access token - redirect to login', error)

    // TODO ?
    return null
    // throw error
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

export const signOut = async () => {
  try {
    await Auth.signOut()
    router.push('/')
  } catch (error) {
    console.log('error signing out', error)
  }
}
