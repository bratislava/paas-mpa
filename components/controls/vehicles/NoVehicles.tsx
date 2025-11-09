import { Link } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import { useTranslation } from '@/hooks/useTranslation'

const NoVehicles = () => {
  const { t } = useTranslation()

  return (
    <EmptyStateScreen
      options={{ headerTransparent: true, headerRight: undefined }}
      title={t('VehiclesScreen.title')}
      backgroundVariant="dots"
      hasBackButton
      contentTitle={t('VehiclesScreen.noVehicles')}
      text={t('VehiclesScreen.noVehiclesText')}
      actionButton={
        <Link asChild href="/vehicles/add-vehicle">
          <ContinueButton variant="secondary">{t('VehiclesScreen.addVehicle')}</ContinueButton>
        </Link>
      }
    />
  )
}

export default NoVehicles
