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
import { useTicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreContext'
import { useTicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/useTicketsFiltersStoreUpdateContext'

const TicketsFiltersScreen = () => {
  const t = useTranslation('TicketsFilters')

  const onPurchaseStoreUpdate = useTicketsFiltersStoreUpdateContext()
  const { ecvs, timeframe } = useTicketsFiltersStoreContext()

  const handleReset = useCallback(() => {
    onPurchaseStoreUpdate(defaultTicketsFiltersStoreContextValues)
  }, [onPurchaseStoreUpdate])

  const fields = useMemo(
    () => [
      {
        key: 'vehicles',
        path: '/tickets/filters/vehicles',
        value: typeof ecvs === 'string' ? t('all') : ecvs.join(', '),
      },
      { key: 'fromTo', path: '/tickets/filters/timeframes', value: t(`timeframes.${timeframe}`) },
    ],
    [t, ecvs, timeframe],
  )

  const actionButton = useMemo(
    () => <ContinueButton onPress={router.back} translationKey="showResults" />,
    [],
  )

  return (
    <ScreenView title={t('title')} actionButton={actionButton}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <PressableStyled onPress={handleReset}>
              <Typography variant="default-bold">{t('reset')}</Typography>
            </PressableStyled>
          ),
        }}
      />
      <View className="py-5 pl-6 pr-4 g-5">
        {fields.map(({ key, path, value }) => (
          <Field key={key} label={t(key)}>
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
