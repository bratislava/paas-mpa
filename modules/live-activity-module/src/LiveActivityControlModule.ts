import { Platform, requireNativeModule } from 'expo-modules-core'

const fallback = {
  areActivitiesEnabled: () => false,
  startActivity(
    _startTime: number,
    _endTime: number,
    _title: string,
    _headline: string,
    _widgetUrl: string,
  ) {
    console.log(_endTime, _headline, _startTime, _title, _widgetUrl)

    return false
  },
  endActivity(_title: string, _headline: string, _widgetUrl: string) {
    console.log(_headline, _title, _widgetUrl)
  },
}

export default Platform.OS === 'ios' ? requireNativeModule('LiveActivityControlModule') : fallback
