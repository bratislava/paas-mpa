import { router } from 'expo-router'
import { Fragment } from 'react'
import { View } from 'react-native'

import { WebviewSearchParams } from '@/app/(app)/about/webview'
import AppVersion from '@/components/info/AppVersion'
import ListRow from '@/components/list-rows/ListRow'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { navigateToStoreReview } from '@/utils/navigateToStore'

const navigateToRoute = (url: string) => {
  router.navigate({
    pathname: '/about/webview',
    params: { webviewUri: url } as WebviewSearchParams,
  })
}

const Page = () => {
  const { t } = useTranslation()

  /* Specify unique key for each item. Using label (with translation) was not working for React. */
  const items = [
    {
      key: 'termsAndConditions',
      label: t('AboutScreen.links.termsAndConditions.label'),
      onPress: () => navigateToRoute(t('AboutScreen.links.termsAndConditions.url')),
      icon: 'language',
    },
    {
      key: 'privacyPolicy',
      label: t('AboutScreen.links.privacyPolicy.label'),
      onPress: () => navigateToRoute(t('AboutScreen.links.privacyPolicy.url')),
      icon: 'description',
    },
    {
      key: 'contactUs',
      label: t('AboutScreen.links.contactUs.label'),
      onPress: () => navigateToRoute(t('AboutScreen.links.contactUs.url')),
      icon: 'phone',
    },
    {
      key: 'rateTheApp',
      label: t('AboutScreen.links.rateTheApp.label'),
      icon: 'star',
      onPress: () => navigateToStoreReview(),
    },
  ] as const

  return (
    // TODO maybe rename actionButton to something like footer
    <ScreenView title={t('AboutScreen.title')} actionButton={<AppVersion />}>
      <ScreenContent>
        <View>
          {items.map((item) => (
            <Fragment key={item.key}>
              <PressableStyled onPress={item.onPress}>
                <ListRow label={item.label} icon={item.icon} />
              </PressableStyled>

              <Divider />
            </Fragment>
          ))}
        </View>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
