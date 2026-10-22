import { fetchUserAttributes } from 'aws-amplify/auth'
import Exponea from 'react-native-exponea-sdk'

import { environment } from '@/environment'
import { clientApi } from '@/modules/backend/client-api'
import {
  TrackConsentChangePropertiesDtoActionEnum,
  TrackConsentChangePropertiesDtoCategoryEnum,
} from '@/modules/backend/openapi-generated'

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

const PARKING_CONSENT_CATEGORIES = [
  TrackConsentChangePropertiesDtoCategoryEnum.General,
  TrackConsentChangePropertiesDtoCategoryEnum.FineEmail,
  TrackConsentChangePropertiesDtoCategoryEnum.FineSms,
]

export const acceptParkingConsents = ({ onConsentFailed }: { onConsentFailed: () => void }) => {
  let hasFailed = false

  PARKING_CONSENT_CATEGORIES.forEach((category) => {
    clientApi
      .consentControllerTrackConsentChange({
        properties: {
          action: TrackConsentChangePropertiesDtoActionEnum.Accept,
          category,
          valid_until: 'unlimited',
        },
      })
      .catch(() => {
        if (hasFailed) return

        hasFailed = true
        onConsentFailed()
      })
  })
}
