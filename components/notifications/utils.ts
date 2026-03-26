import { fetchUserAttributes } from 'aws-amplify/auth'
import Exponea from 'react-native-exponea-sdk'

import { environment } from '@/environment'

export const getBloomreachId = async (): Promise<string | undefined> => {
  try {
    const attributes = await fetchUserAttributes()

    return attributes['custom:bloomreachId']
  } catch (error) {
    console.log('Error fetching attributes:', error)
  }

  return undefined
}

export const configureExponea = async (bloomreachId: string, phoneNumber: string) => {
  try {
    const isConfigured = await Exponea.isConfigured()

    if (isConfigured) {
      return
    }

    await Exponea.configure({
      projectToken: environment.bloomreachProjectToken,
      authorizationToken: environment.bloomreachAuthorizationToken,
      baseUrl: environment.bloomreachBaseUrl,
    })

    await Exponea.identifyCustomer({ external_id: bloomreachId }, { phone: phoneNumber })

    console.log('Exponea SDK configured.')
  } catch (error) {
    console.log('error configuring exponea', error)
    throw error
  }
}
