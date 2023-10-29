import { Stack } from 'expo-router'

import PurchaseStoreProvider from '@/state/PurchaseStoreProvider/PurchaseStoreProvider'
import colors from '@/tailwind.config.colors'

const PurchaseAndPaymentLayout = () => {
  return (
    <PurchaseStoreProvider>
      <Stack
        screenOptions={{
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'BelfastGrotesk_700Bold',
          },
          headerTintColor: colors.dark.DEFAULT,
        }}
      >
        <Stack.Screen name="purchase/choose-vehicle" options={{ presentation: 'modal' }} />
        <Stack.Screen name="purchase/choose-payment-method" options={{ presentation: 'modal' }} />
      </Stack>
    </PurchaseStoreProvider>
  )
}

export default PurchaseAndPaymentLayout
