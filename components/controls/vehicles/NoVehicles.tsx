import { Link } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import { useTranslation } from '@/hooks/useTranslation'

const NoVehicles = () => {
  const t = useTranslation('VehiclesScreen')

  return (
    <EmptyStateScreen
      title={t('title')}
      backgroundVariant="dots"
      hasBackButton
      contentTitle={t('noVehicles')}
      text={t('noVehiclesText')}
      actionButton={
        <Link asChild href="/vehicles/add-vehicle">
          <ContinueButton>{t('addVehicle')}</ContinueButton>
        </Link>
      }
    />
  )
}

export default NoVehicles
