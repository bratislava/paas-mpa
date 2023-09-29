import BottomSheet from '@gorhom/bottom-sheet'
import { useCallback, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'

import SegmentBadge from '@/components/info/SegmentBadge'
import TextInput from '@/components/inputs/TextInput'
import Map from '@/components/map/Map'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import Button from '@/components/shared/Button'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { SelectedUdrZone } from '@/modules/map/types'

import PressableStyled from '../shared/PressableStyled'

const MapScreen = () => {
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
          <View className="bg-white g-3">
            <View className="g-2">
              <Field label={t('MapScreen.BottomSheet.title')}>
                <TextInput />
              </Field>
              {bottomSheetContent && (
                <Panel className="g-4">
                  <FlexRow>
                    <Typography>{bottomSheetContent.Nazov}</Typography>
                    <SegmentBadge label={bottomSheetContent.UDR_ID.toString()} />
                  </FlexRow>
                  <Divider />
                  <FlexRow>
                    <Typography variant="default-bold">
                      {bottomSheetContent.Zakladna_cena}€ / h
                    </Typography>
                    <PressableStyled>
                      <View className="flex-row">
                        <Typography variant="default-bold">
                          {t('MapScreen.BottomSheet.showDetails')}
                        </Typography>
                        <Icon name="expand-more" />
                      </View>
                    </PressableStyled>
                  </FlexRow>
                </Panel>
              )}
            </View>
            {bottomSheetContent ? (
              <Button variant="primary">{t('Navigation.continue')}</Button>
            ) : (
              <Panel className="bg-warning-light g-2">
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
