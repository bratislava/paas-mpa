import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useRef } from 'react'
import { View } from 'react-native'

import FilterRow from '@/components/list-rows/FilterRow'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import TimeframeTicketFilterBottomSheet from '@/components/tickets/TimeframeTicketFilterBottomSheet'
import { useTimeframesTranslation } from '@/hooks/useTimeframesTranslation'
import { useTranslation } from '@/hooks/useTranslation'
import { defaultTicketsFiltersStoreContextValues } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreContext'
import { useTicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreUpdateContext'

const TicketsFiltersScreen = () => {
  const { t } = useTranslation()

  const onTicketsFiltersStoreUpdate = useTicketsFiltersStoreUpdateContext()
  const filters = useTicketsFiltersStoreContext()
  const translationMapTimeframes = useTimeframesTranslation()

  const bottomSheetRef = useRef<BottomSheet>(null)

  const { ecvs, timeframe } = filters

  const handleResetFilters = () => {
    onTicketsFiltersStoreUpdate(defaultTicketsFiltersStoreContextValues)
  }

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
      value: translationMapTimeframes[timeframe],
      onPress: () => bottomSheetRef.current?.expand(),
    },
  ]

  return (
    <>
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
          {fields.map(({ key, label, path, value, onPress }) => (
            <Field key={key} label={label}>
              {path ? (
                <Link asChild href={{ pathname: path }}>
                  <FilterRow label={value} />
                </Link>
              ) : (
                <FilterRow label={value} onPress={onPress} />
              )}
            </Field>
          ))}
        </View>
      </ScreenView>

      <TimeframeTicketFilterBottomSheet ref={bottomSheetRef} />
    </>
  )
}

export default TicketsFiltersScreen
