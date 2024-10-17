import messaging from '@react-native-firebase/messaging'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'

import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'
import { useEffectOnce } from '@/hooks/useEffectOnce'
import { clientApi } from '@/modules/backend/client-api'
import { useSignOut } from '@/modules/cognito/hooks/useSignOut'
import { getCurrentAuthenticatedUser } from '@/modules/cognito/utils'

const UserDevPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  const signOut = useSignOut()
  const { show } = useSnackbar()

  const deleteDeviceMutation = useMutation({
    mutationFn: async (tokenInner: string) =>
      clientApi.mobileDevicesControllerDeleteMobileDeviceByToken(tokenInner),
    onSuccess: () => {
      show('Device removed', { variant: 'success' })
    },
    onError: () => {
      show('Device not removed', { variant: 'danger' })
    },
  })

  const removeDevice = async () => {
    const token = await messaging().getToken()
    deleteDeviceMutation.mutate(token)
  }

  useEffectOnce(() => {
    getCurrentAuthenticatedUser()
      .then((userInner) => {
        setUser(userInner)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return userInner
      })
      .catch((error) => {
        console.log(error)
      })
  })

  return (
    <ScreenView>
      <ScrollView>
        <ScreenContent>
          <Typography variant="h1">User</Typography>
          <Link asChild href="/sign-in" disabled={!!user}>
            <Button>Login</Button>
          </Link>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button onPress={signOut} disabled={!user}>
            Logout
          </Button>
          <Link asChild href="/">
            <Button>Home</Button>
          </Link>
          <Button onPress={removeDevice}>Remove device from notifications</Button>
          <Typography>{JSON.stringify(user, undefined, 2)}</Typography>
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default UserDevPage
