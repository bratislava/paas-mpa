import { Link } from 'expo-router'
import React, { Fragment } from 'react'
import { View } from 'react-native'

import { WebviewSearchParams } from '@/app/(app)/about/webview'
import AppVersion from '@/components/info/AppVersion'
import ListRow from '@/components/list-rows/ListRow'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('AboutScreen')

  /* Specify unique key for each item. Using label (with translation) was not working for React. */
  const links = [
    {
      key: 1,
      label: t('links.termsAndConditions.label'),
      url: t('links.termsAndConditions.url'),
      icon: 'language',
    },
    {
      key: 2,
      label: t('links.privacyPolicy.label'),
      url: t('links.privacyPolicy.url'),
      icon: 'description',
    },
    {
      key: 3,
      label: t('links.contactUs.label'),
      url: t('links.contactUs.url'),
      icon: 'phone',
    },
    // {
    //   key: 4,
    //   label: t('links.rateTheApp.label'),
    //   url: t('links.rateTheApp.url'),
    //   icon: 'star',
    // },
  ] as const

  return (
    // TODO maybe rename actionButton to something like footer
    <ScreenView title={t('title')} hasBackButton actionButton={<AppVersion />}>
      <ScreenContent>
        <View>
          {links.map((link) => (
            <Fragment key={link.key}>
              <Link
                asChild
                href={{
                  pathname: `/about/webview`,
                  params: { webviewUri: encodeURI(link.url) } satisfies WebviewSearchParams,
                }}
              >
                <PressableStyled>
                  <ListRow label={link.label} icon={link.icon} />
                </PressableStyled>
              </Link>
              <Divider />
            </Fragment>
          ))}
        </View>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
