import { Platform, requireNativeModule } from 'expo-modules-core'

const fallback = {
  areActivitiesEnabled: () => false,
  startActivity: async (
    _startTime: number,
    _endTime: number,
    _licencePlate: string,
    _parkingLocation: string,
    _widgetUrl: string,
  ) => {
    console.log(_endTime, _parkingLocation, _startTime, _licencePlate, _widgetUrl)

    return false
  },
  endActivity: async (_licencePlate: string, _parkingLocation: string, _widgetUrl: string) => {
    console.log(_parkingLocation, _licencePlate, _widgetUrl)
  },
}

type LiveActivityControlModule = {
  areActivitiesEnabled: () => boolean
  startActivity: (
    startTime: number,
    endTime: number,
    licencePlate: string,
    parkingLocation: string,
    widgetUrl: string,
  ) => Promise<string | null>
  endActivity: (licencePlate: string, parkingLocation: string, widgetUrl: string) => Promise<void>
}

export default Platform.OS === 'ios'
  ? requireNativeModule<LiveActivityControlModule>('LiveActivityControlModule')
  : fallback
