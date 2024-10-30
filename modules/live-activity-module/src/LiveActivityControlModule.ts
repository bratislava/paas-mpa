import { Platform, requireNativeModule } from 'expo-modules-core'

const fallback = {
  areActivitiesEnabled: () => false,
  startActivity: async (
    _startTime: number,
    _endTime: number,
    _licencePlate: string,
    _parkingLocation: string,
  ) => {
    console.log(_endTime, _parkingLocation, _startTime, _licencePlate)

    return null
  },
  updateActivity: async (
    _id: string,
    _startTime: number,
    _endTime: number,
    _licencePlate: string,
    _parkingLocation: string,
  ) => {
    console.log(_endTime, _parkingLocation, _startTime, _licencePlate)

    return null
  },
  endActivity: async (id: string) => {
    console.log(id)

    return null
  },

  // Nice-to-have for testing purposes (not used in the app)
  endAllActivities: async () => {
    console.log('endAllActivities')
  },
}

type LiveActivityControlModule = {
  areActivitiesEnabled: () => boolean
  startActivity: (
    startTime: number,
    endTime: number,
    licencePlate: string,
    parkingLocation: string,
  ) => Promise<string | null>
  updateActivity: (
    id: string,
    startTime: number,
    endTime: number,
    licencePlate: string,
    parkingLocation: string,
  ) => Promise<string | null>
  endActivity: (id: string) => Promise<string | null>
  endAllActivities: () => Promise<void>
}

export default Platform.OS === 'ios'
  ? requireNativeModule<LiveActivityControlModule>('LiveActivityControlModule')
  : fallback
