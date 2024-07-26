import { PermissionsAndroid } from 'react-native'

/**
 * This function needs to live in separate file, because it uses android specific components - eslint rule react-native/split-platform-components
 */
export const requestNotificationPermissionAndroidAsync = async () =>
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
