import { Link, router, Stack } from 'expo-router'
import { useCallback, useMemo } from 'react'
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
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/usePurchaseStoreContext'
import { useTicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/usePurchaseStoreUpdateContext'

const TicketsFiltersScreen = () => {
  const t = useTranslation('TicketsFilters')
  const tCommon = useTranslation('Common')

  const onPurchaseStoreUpdate = useTicketsFiltersStoreUpdateContext()
  const { ecv, timeframe } = useTicketsFiltersStoreContext()

  const handleReset = useCallback(() => {
    onPurchaseStoreUpdate(defaultTicketsFiltersStoreContextValues)
  }, [onPurchaseStoreUpdate])

  const fields = useMemo(
    () => [
      { key: 'vehicles', path: '/tickets/filters/vehicles', value: ecv ?? t('all') },
      { key: 'fromTo', path: '/tickets/filters/timeframes', value: t(`timeframes.${timeframe}`) },
    ],
    [t, ecv, timeframe],
  )

  const actionButton = useMemo(
    () => <ContinueButton onPress={router.back}>{tCommon('showResults')}</ContinueButton>,
    [tCommon],
  )

  return (
    <ScreenView title={t('title')} actionButton={actionButton}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <PressableStyled onPress={handleReset}>
              <Typography>{t('reset')}</Typography>
            </PressableStyled>
          ),
        }}
      />
      <View className="py-5 pl-6 pr-4">
        {fields.map(({ key, path, value }) => (
          <Field key={key} label={t(key)}>
            <Link asChild href={{ pathname: path }}>
              <PressableStyled>
                <Panel>
                  <FlexRow>
                    <Typography variant="default-bold">{value}</Typography>
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
