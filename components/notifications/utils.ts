import Exponea from 'react-native-exponea-sdk'

import { environment } from '@/environment'

export const configureExponea = async (externalId: string) => {
  try {
    if (await Exponea.isConfigured()) {
      console.log('Exponea SDK already configured.')
    } else {
      await Exponea.configure({
        projectToken: environment.bloomreachProjectToken,
        authorizationToken: environment.bloomreachAuthorizationToken,
        baseUrl: environment.bloomreachBaseUrl,
      })

      await Exponea.identifyCustomer({ external_id: externalId }, {})

      console.log('Exponea SDK configured.')
    }
  } catch (error) {
    console.log('error configuring exponea', error)
  }
}
