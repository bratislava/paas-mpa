import { Link } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useTranslation } from '@/hooks/useTranslation'

// TODO nicer design
const NoVehicles = () => {
  const t = useTranslation('VehiclesScreen')

  return (
    <ScreenView backgroundVariant="dots">
      <EmptyStateScreen
        contentTitle={t('noVehicles')}
        text={t('noVehiclesText')}
        actionButton={
          <Link asChild href="/vehicles/add-vehicle">
            <ContinueButton>{t('addVehicle')}</ContinueButton>
          </Link>
        }
      />
    </ScreenView>
  )
}

export default NoVehicles
