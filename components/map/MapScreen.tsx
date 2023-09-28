/* eslint-disable @typescript-eslint/no-unused-vars */
import BottomSheet from '@gorhom/bottom-sheet'
import { useCallback, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'

import TextInput from '@/components/inputs/TextInput'
import Map from '@/components/map/Map'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { SelectedUdrZone } from '@/modules/map/types'

import SegmentBadge from '../info/SegmentBadge'
import Button from '../shared/Button'
import Divider from '../shared/Divider'
import Field from '../shared/Field'
import FlexRow from '../shared/FlexRow'
import Panel from '../shared/Panel'

const MapScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bottomSheetContent, setBottomSheetContent] = useState<SelectedUdrZone>(null)
  const t = useTranslation()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const handleBottomSheetChange = useCallback(
    (content: SelectedUdrZone) => {
      setBottomSheetContent(content)
      console.log(content)
      if (content) bottomSheetRef.current?.expand()
      else bottomSheetRef.current?.snapToIndex(0)
    },
    [setBottomSheetContent],
  )

  const snapPoints = useMemo(() => [250, 350], [])

  return (
    <View className="flex-1 items-stretch">
      <Map onBottomSheetContentChange={handleBottomSheetChange} />
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <BottomSheetContent cn="bg-white">
          <View className="bg-white">
            <Field label={t('MapScreen.BottomSheet.title')}>
              <TextInput />
            </Field>
            {bottomSheetContent ? (
              <>
                <Panel className="my-2 g-4">
                  <FlexRow>
                    <Typography>{bottomSheetContent.Nazov}</Typography>
                    <SegmentBadge label={bottomSheetContent.UDR_ID.toString()} />
                  </FlexRow>
                  <Divider />
                  <FlexRow>
                    <Typography variant="default-bold">
                      {bottomSheetContent.Zakladna_cena}€ / h
                    </Typography>
                    <Typography variant="default-bold">
                      {t('MapScreen.BottomSheet.showDetails')}
                    </Typography>
                  </FlexRow>
                </Panel>
                <Button className="my-1" variant="primary">
                  {t('Navigation.continue')}
                </Button>
              </>
            ) : (
              <Panel className="my-3 bg-warning-light">
                <Typography>{t('MapScreen.BottomSheet.noZoneSelected')}</Typography>
              </Panel>
            )}
          </View>
        </BottomSheetContent>
      </BottomSheet>
    </View>
  )
}

export default MapScreen
