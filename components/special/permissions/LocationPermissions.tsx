// TODO Use ScreenView

import { PermissionStatus } from 'expo-location'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { RouteComponentProps } from '@/app/permissions'
import { ImageLocationPermissions } from '@/assets/onboarding-slides'
import { PermissionsSlide } from '@/components/special/permissions/PermissionsSlide'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'

export const LocationPermissions = ({ onContinue }: RouteComponentProps) => {
  const { t } = useTranslation()

  const { locationPermissionStatus, getLocationPermission } = useLocationPermission()

  useEffect(() => {
    if (locationPermissionStatus !== PermissionStatus.UNDETERMINED) {
      onContinue()
    }
  }, [onContinue, locationPermissionStatus])

  return (
    <PermissionsSlide
      title={t('PermissionsScreen.location.title')}
      text={t('PermissionsScreen.location.text')}
      SvgImage={ImageLocationPermissions}
      onPress={getLocationPermission}
    />
  )
}
