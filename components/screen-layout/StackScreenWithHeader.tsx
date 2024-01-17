import clsx from 'clsx'
import { router, Stack } from 'expo-router'
import { useCallback, useState } from 'react'
import { LayoutChangeEvent, Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

import IconButton from '../shared/IconButton'

type Props = React.ComponentProps<typeof Stack.Screen>

/**
 * Component that wraps Stack.Screen and adds some default options
 */
const StackScreenWithHeader = ({ options, ...passingProps }: Props) => {
  const t = useTranslation('Common')
  const insets = useSafeAreaInsets()
  const [headerLeftWidth, setHeaderLeftWidth] = useState(0)
  const [headerRightWidth, setHeaderRightWidth] = useState(0)
  const handleHeaderLeftLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderLeftWidth(event.nativeEvent.layout.width)
  }, [])
  const handleHeaderRightLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderRightWidth(event.nativeEvent.layout.width)
  }, [])

  const headerSideWidth = Math.max(headerLeftWidth, headerRightWidth)

  const renderHeader: NonNullable<NonNullable<Props['options']>['header']> = useCallback(
    ({ options: headerOptions, back }) => {
      return (
        <View
          className={clsx('w-full flex-row', { 'bg-white': !headerOptions?.headerTransparent })}
          style={{ paddingTop: insets.top }}
        >
          <View className="w-full flex-row items-center px-5 py-3">
            {!!back && headerOptions?.headerBackVisible !== false ? (
              <IconButton
                onPress={router.back}
                accessibilityLabel={t('goBack')}
                name="arrow-back"
                onLayout={handleHeaderLeftLayout}
              />
            ) : null}
            <View
              className="min-w-0 flex-1 flex-row items-center justify-center px-2"
              style={{
                marginLeft: headerSideWidth - headerLeftWidth,
                marginRight: headerSideWidth - headerRightWidth,
              }}
            >
              <Typography variant="h2" numberOfLines={1} className="max-w-full">
                {headerOptions?.title}
              </Typography>
            </View>
            <View className="flex-0" onLayout={handleHeaderRightLayout}>
              {headerOptions?.headerRight?.({
                tintColor: headerOptions.headerTintColor,
                canGoBack: !!back,
              })}
            </View>
          </View>
        </View>
      )
    },
    [
      insets.top,
      t,
      handleHeaderLeftLayout,
      handleHeaderRightLayout,
      headerSideWidth,
      headerLeftWidth,
      headerRightWidth,
    ],
  )

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        ...options,
        header:
          options?.presentation === 'modal' && Platform.OS === 'ios' ? undefined : renderHeader,
      }}
      {...passingProps}
    />
  )
}

export default StackScreenWithHeader
