import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'

import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { defaultTicketsFiltersStoreContextValues } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreContext'
import { useTicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreUpdateContext'

const TicketsFiltersScreen = () => {
  const { t } = useTranslation()

  const onTicketsFiltersStoreUpdate = useTicketsFiltersStoreUpdateContext()
  const filters = useTicketsFiltersStoreContext()

  const { ecvs, timeframe } = filters

  const handleResetFilters = () => {
    onTicketsFiltersStoreUpdate(defaultTicketsFiltersStoreContextValues)
  }

  // TODO translations
  const translationKeys = [
    t('TicketsFilters.timeframes.lastMonth'),
    t('TicketsFilters.timeframes.lastYear'),
    t('TicketsFilters.timeframes.thisMonth'),
    t('TicketsFilters.timeframes.thisYear'),
  ]
  const fields = [
    {
      key: 'vehicles',
      label: t('TicketsFilters.vehicles'),
      path: '/tickets/filters/vehicles',
      value: typeof ecvs === 'string' ? t('TicketsFilters.all') : ecvs.join(', '),
    },
    {
      key: 'fromTo',
      label: t('TicketsFilters.fromTo'),
      path: '/tickets/filters/timeframes',
      // TODO translations
      value: t(`TicketsFilters.timeframes.${timeframe}`),
    },
  ]

  return (
    <ScreenView
      title={t('TicketsFilters.title')}
      options={{
        headerRight: () => (
          <PressableStyled onPress={handleResetFilters}>
            <Typography variant="default-bold">{t('TicketsFilters.reset')}</Typography>
          </PressableStyled>
        ),
        presentation: 'modal',
      }}
      actionButton={
        <ContinueButton onPress={() => router.back()}>
          {t('TicketsFilters.showResults')}
        </ContinueButton>
      }
    >
      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" />

      <View className="p-5 g-5">
        {fields.map(({ key, label, path, value }) => (
          <Field key={key} label={label}>
            <Link asChild href={{ pathname: path }}>
              <PressableStyled>
                <Panel>
                  <FlexRow>
                    <Typography
                      variant="default-bold"
                      numberOfLines={1}
                      className="shrink text-ellipsis"
                    >
                      {value}
                    </Typography>
                    <Icon name="expand-more" />
                  </FlexRow>
                </Panel>
              </PressableStyled>
            </Link>
          </Field>
        ))}
      </View>
    </ScreenView>
  )
}

export default TicketsFiltersScreen
