import { Link, Stack } from 'expo-router'
import { useCallback } from 'react'
import { View } from 'react-native'

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

const TicketsFilters = () => {
  const t = useTranslation('TicketsFilters')

  const onPurchaseStoreUpdate = useTicketsFiltersStoreUpdateContext()
  const { ecv, timeframe } = useTicketsFiltersStoreContext()

  const handleReset = useCallback(() => {
    onPurchaseStoreUpdate(defaultTicketsFiltersStoreContextValues)
  }, [onPurchaseStoreUpdate])

  return (
    <ScreenView title={t('title')}>
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
        <Field label={t('vehicles')}>
          <Link asChild href={{ pathname: '/purchase/choose-vehicle' }}>
            <PressableStyled>
              <Panel>
                <FlexRow>
                  <Typography variant="default-bold">{ecv}</Typography>
                  <Icon name="expand-more" />
                </FlexRow>
              </Panel>
            </PressableStyled>
          </Link>
        </Field>

        <Field label={t('fromTo')}>
          <Link asChild href={{ pathname: '/purchase/choose-vehicle' }}>
            <PressableStyled>
              <Panel>
                <FlexRow>
                  <Typography variant="default-bold">{timeframe}</Typography>
                  <Icon name="expand-more" />
                </FlexRow>
              </Panel>
            </PressableStyled>
          </Link>
        </Field>
      </View>
    </ScreenView>
  )
}

export default TicketsFilters
