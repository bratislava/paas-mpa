import { Link } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

import { WebviewSearchParams } from '@/app/about/webview'
import ListRow from '@/components/list-rows/ListRow'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('AboutScreen')

  const links = [
    {
      label: t('links.termsAndConditions.label'),
      url: t('links.termsAndConditions.url'),
      icon: 'language',
    },
    {
      label: t('links.privacyPolicy.label'),
      url: t('links.privacyPolicy.url'),
      icon: 'description',
    },
    {
      label: t('links.contactUs.label'),
      url: t('links.contactUs.url'),
      icon: 'phone',
    },
    {
      label: t('links.rateTheApp.label'),
      url: t('links.rateTheApp.url'),
      icon: 'star',
    },
  ] as const

  return (
    <ScreenView title={t('title')}>
      <ScreenContent>
        <View>
          {links.map((link) => (
            <>
              <Link
                key={link.label}
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
            </>
          ))}
        </View>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
