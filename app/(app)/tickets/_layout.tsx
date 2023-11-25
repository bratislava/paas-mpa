import { Stack } from 'expo-router'

import TicketsFiltersStoreProvider from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'
import colors from '@/tailwind.config.colors'

const TicketsLayout = () => {
  return (
    <TicketsFiltersStoreProvider>
      <Stack
        screenOptions={{
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'BelfastGrotesk_700Bold',
          },
          headerTintColor: colors.dark.DEFAULT,
        }}
      >
        <Stack.Screen name="filters/index" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="filters/timeframes"
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'none',
          }}
        />
      </Stack>
    </TicketsFiltersStoreProvider>
  )
}

export default TicketsLayout
