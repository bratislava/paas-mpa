import React, { useState } from 'react'

import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { clientApi } from '@/modules/backend/client-api'

const HealthcheckScreen = () => {
  const [healthcheck, setHealthcheck] = useState<boolean | null>(null)

  clientApi
    .appControllerHealth()
    .then((res) => {
      if (res.status) setHealthcheck(true)
      console.log(res.status)

      return res.data
    })
    .catch((error) => {
      setHealthcheck(false)
      console.log(error)
    })

  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">Healthcheck</Typography>
        <Typography>{healthcheck === null ? 'loading' : String(healthcheck)}</Typography>
      </ScreenContent>
    </ScreenView>
  )
}
export default HealthcheckScreen
