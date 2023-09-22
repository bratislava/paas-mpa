import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { Link } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { FlatList } from 'react-native'

import ActionRow from '@/components/actions/ActionRow'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import NoVehicles from '@/components/vehicles/NoVehicles'
import VehicleRow from '@/components/vehicles/VehicleRow'
import { useTranslation } from '@/hooks/useTranslation'
import { useVehicles } from '@/hooks/useVehicles'

const VehiclesScreen = () => {
  const t = useTranslation('VehiclesScreen')

  const { vehicles, deleteVehicle, setDefaultVehicle } = useVehicles()

  const [activeVehicle, setActiveVehicle] = useState<null | string>(null)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  const handlePress = (licencePlate: string) => {
    setActiveVehicle(licencePlate)
    bottomSheetRef.current?.expand()
  }

  const handleDelete = (licencePlate: string | null) => {
    if (licencePlate) {
      deleteVehicle(licencePlate)
    }
    bottomSheetRef.current?.close()
  }

  const handleSetDefault = (licencePlate: string | null) => {
    if (licencePlate) {
      setDefaultVehicle(licencePlate)
    }
    bottomSheetRef.current?.close()
  }

  return (
    <ScreenView>
      <ScreenContent>
        <Field label={t('myVehicles')}>
          <FlatList
            data={vehicles}
            keyExtractor={(vehicle) => vehicle.licencePlate}
            ItemSeparatorComponent={() => <Divider dividerClassname="bg-transparent h-1" />}
            renderItem={({ item, index }) => (
              <VehicleRow
                vehicle={item}
                onContextMenuPress={() => handlePress(item.licencePlate)}
                isDefault={index === 0}
              />
            )}
            ListEmptyComponent={() => <NoVehicles />}
          />
        </Field>

        <Link href="/vehicles/add-vehicle" asChild>
          <Button>{t('addVehicle')}</Button>
        </Link>
      </ScreenContent>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetContent>
          <ActionRow
            icon="check-circle"
            label={t('actions.saveAsDefault')}
            onPress={() => handleSetDefault(activeVehicle)}
          />
          <Divider />
          {/* <ActionRow icon="edit" label="Edit vehicle" /> */}
          {/* <Divider /> */}
          <ActionRow
            icon="delete"
            label={t('actions.deleteVehicle')}
            variant="negative"
            onPress={() => handleDelete(activeVehicle)}
          />
        </BottomSheetContent>
      </BottomSheet>
    </ScreenView>
  )
}

export default VehiclesScreen
