import * as Application from 'expo-application'
import React from 'react'
import { View } from 'react-native'

import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const AppVersion = () => {
  const { t } = useTranslation()

  return (
    <View>
      {/* TODO displaying also build version for testing */}
      <Typography className="text-center">
        {t('AppVersion.appVersion', {
          version: `${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`,
        })}
      </Typography>
    </View>
  )
}

export default AppVersion
