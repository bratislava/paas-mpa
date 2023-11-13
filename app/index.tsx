import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { PortalHost } from '@gorhom/portal'
import { Link, router, Stack } from 'expo-router'
import { ReactNode, useCallback, useMemo, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ActionRow from '@/components/list-rows/ActionRow'
import MapScreen from '@/components/map/MapScreen'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import { IconName } from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { announcementsOptions } from '@/modules/backend/constants/queryOptions'
import { useLastReadAnnouncementIdStorage } from '@/modules/backend/hooks/useLastReadAnnouncementIdStorage'

const handleLongPress = () => {
  router.push('/dev')
}

const IndexScreen = () => {
  const t = useTranslation()
  const locale = useLocale()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { top } = useSafeAreaInsets()

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const snapPoints = useMemo(() => ['100%'], [])

  const handlePressOpen = () => {
    bottomSheetRef.current?.expand()
  }

  const handlePressClose = () => {
    bottomSheetRef.current?.close()
  }

  const [lastReadAnnouncementId] = useLastReadAnnouncementIdStorage()
  const { data: announcementsData } = useQueryWithFocusRefetch(announcementsOptions(locale))
  const newAnnouncementsCount = lastReadAnnouncementId
    ? announcementsData?.announcements?.filter(
        (announcement) => announcement.id > lastReadAnnouncementId,
      ).length
    : announcementsData?.announcements.length

  const menuItems: {
    label: string
    icon: IconName
    path: string
    endSlot?: ReactNode
  }[] = [
    {
      label: t('VehiclesScreen.title'),
      icon: 'directions-car',
      path: '/vehicles',
    },
    {
      label: t('ParkingCards.title'),
      icon: 'card-membership',
      path: '/parking-cards',
    },
    {
      label: t('PaymentMethods.title'),
      icon: 'payment',
      path: '/payment-options',
    },
    {
      label: t('Tickets.title'),
      icon: 'local-parking',
      path: '/tickets',
    },
    {
      label: t('Settings.title'),
      icon: 'settings',
      path: '/settings',
    },
    {
      label: t('Announcements.title'),
      icon: 'notifications',
      path: '/announcements',
      endSlot: newAnnouncementsCount ? (
        <View className="h-6 w-6 items-center justify-center rounded-full bg-warning">
          <Typography variant="small" className="leading-6 text-white">
            {newAnnouncementsCount}
          </Typography>
        </View>
      ) : undefined,
    },
    {
      label: 'Purchase DEV',
      icon: 'payment',
      path: '/purchase',
    },
  ]

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />

      <MapScreen />

      <View className="absolute right-0 px-2.5 g-3" style={{ top }}>
        <View>
          <IconButton
            name="more-vert"
            // TODO translation
            accessibilityLabel="Open menu"
            variant="white-raised-small"
            onPress={handlePressOpen}
            onLongPress={handleLongPress}
          />
          {newAnnouncementsCount ? (
            <View className="absolute right-2 top-2 rounded-full bg-white p-1">
              <View className="h-2 w-2 rounded-full bg-warning" />
            </View>
          ) : null}
        </View>

        {/* <Link asChild href="/user"> */}
        {/*   <IconButton */}
        {/*     name="person" */}
        {/*     accessibilityLabel="To be removed - temporary indicator that user is logged in" */}
        {/*     variant="dark-small" */}
        {/*   /> */}
        {/* </Link> */}
      </View>

      <PortalHost name="index" />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        detached
        enablePanDownToClose
        handleComponent={() => (
          <IconButton
            name="close"
            // TODO translation
            accessibilityLabel="Close menu"
            className="absolute right-4 top-4"
            onPress={handlePressClose}
          />
        )}
        topInset={top + 80}
        bottomInset={50}
        style={styles.sheetContainer}
      >
        <BottomSheetContent cn="justify-between flex-1" hideSpacer>
          <View>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                asChild
                href={item.path}
                onPress={() => bottomSheetRef.current?.close()}
              >
                <PressableStyled className="flex-row items-center">
                  <View className="flex-1">
                    <ActionRow startIcon={item.icon} label={item.label} />
                  </View>
                  {item.endSlot}
                </PressableStyled>
              </Link>
            ))}
          </View>

          <View>
            <Link asChild href="/dev/" onPress={() => bottomSheetRef.current?.close()}>
              <PressableStyled>
                <ActionRow label="Dev menu" />
              </PressableStyled>
            </Link>

            {/* /!* eslint-disable-next-line @typescript-eslint/no-misused-promises *!/ */}
            {/* <PressableStyled onPress={signOut}> */}
            {/*   <ActionRow endIcon="logout" label="Logout" variant="negative" /> */}
            {/* </PressableStyled> */}

            {/* TODO TMP, replace by Login/Logout */}
            <Link asChild href="/user" onPress={() => bottomSheetRef.current?.close()}>
              <PressableStyled>
                <ActionRow endIcon="login" label="User" />
              </PressableStyled>
            </Link>
          </View>
        </BottomSheetContent>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  sheetContainer: {
    // add horizontal space
    marginHorizontal: 24,
  },
})

export default IndexScreen
