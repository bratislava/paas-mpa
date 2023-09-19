import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-vehicle"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}

export default Layout
