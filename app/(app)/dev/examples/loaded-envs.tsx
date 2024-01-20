import React from 'react'

import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { environment } from '@/environment'

const LoadedEnvs = () => {
  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">Envs</Typography>
        <Typography>nodeEnv: {environment.nodeEnv}</Typography>
        <Typography>apiUrl: {environment.apiUrl}</Typography>
        <Typography>deployment: {environment.deployment}</Typography>
        <Typography>minioBucket: {environment.minioBucket}</Typography>
        <Typography>awsRegion: {environment.awsRegion}</Typography>
        <Typography>cognitoClientId: {environment.cognitoClientId}</Typography>
        <Typography>cognitoUserPoolId: {environment.cognitoUserPoolId}</Typography>
        <Typography>mapboxPublicKey: {environment.mapboxPublicKey}</Typography>
      </ScreenContent>
    </ScreenView>
  )
}

export default LoadedEnvs
