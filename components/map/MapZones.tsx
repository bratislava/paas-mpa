/* eslint-disable unicorn/no-array-reduce */
import { FillLayer, LineLayer, ShapeSource } from '@rnmapbox/maps'
import { FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { useMemo } from 'react'

import { MapZoneStatusEnum } from '@/modules/map/constants'
import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'
import udrStyle from '@/modules/map/utils/layer-styles/visitors'

type Props = {
  udrData: FeatureCollection<Polygon | MultiPolygon, MapUdrZoneWithTranslationProps>
}

const MapZones = ({ udrData }: Props) => {
  const udrDataByStatus = useMemo(
    () => ({
      active: {
        ...udrData,
        features: udrData?.features.filter(
          (udr) => udr.properties?.status === MapZoneStatusEnum.active,
        ),
      },
      planned: {
        ...udrData,
        features: udrData?.features.filter(
          (udr) => udr.properties?.status === MapZoneStatusEnum.planned,
        ),
      },
    }),
    [udrData],
  )

  return (
    <>
      {udrData.features?.length > 0 && (
        <ShapeSource id="udrSource" shape={udrData}>
          <FillLayer
            id="udrFill"
            style={udrStyle.find((styleLayer) => styleLayer.id === 'udr-fill')?.paint}
          />
        </ShapeSource>
      )}
      {udrDataByStatus.active.features?.length > 0 && (
        <ShapeSource id="udrSourceActive" shape={udrDataByStatus.active}>
          <LineLayer
            id="udrLineActive"
            style={udrStyle.find((styleLayer) => styleLayer.id === 'udr-line-active')?.paint}
          />
        </ShapeSource>
      )}
      {udrDataByStatus.planned.features?.length > 0 && (
        <ShapeSource id="udrSourcePlanned" shape={udrDataByStatus.planned}>
          <LineLayer
            id="udrLinePlanned"
            style={udrStyle.find((styleLayer) => styleLayer.id === 'udr-line-planned')?.paint}
          />
        </ShapeSource>
      )}
    </>
  )
}

export default MapZones
