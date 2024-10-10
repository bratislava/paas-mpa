import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

export const LicencePlateFormatWarningPanel = () => {
  const { t } = useTranslation()

  return (
    <Panel className="bg-warning-light">
      <Typography>{t('VehiclesModal.licencePlateFormatWarning')}</Typography>
    </Panel>
  )
}
