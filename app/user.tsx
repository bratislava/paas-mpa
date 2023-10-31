import { Link } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'

import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'
import { getCurrentAuthenticatedUser, signOut } from '@/modules/cognito/utils'

// TODO this is just temporary page
const Page = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getCurrentAuthenticatedUser()
      .then((userInner) => {
        setUser(userInner)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return userInner
      })
      .catch((error) => {
        console.log(error)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScreenView>
      <ScrollView>
        <ScreenContent>
          <Typography variant="h1">User</Typography>
          <Link asChild href="/auth" disabled={!!user}>
            <Button>Login</Button>
          </Link>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button onPress={signOut} disabled={!user}>
            Logout
          </Button>
          <Link asChild href="/">
            <Button>Home</Button>
          </Link>
          <Typography>{JSON.stringify(user, undefined, 2)}</Typography>
        </ScreenContent>
      </ScrollView>
    </ScreenView>
  )
}

export default Page
