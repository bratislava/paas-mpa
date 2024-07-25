import { PermissionsAndroid } from 'react-native'

export const requestNotificationPermissionAndroidAsync = async () =>
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
