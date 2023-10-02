/* eslint-disable unicorn/no-array-reduce */
import { FillLayer, ShapeSource } from '@rnmapbox/maps'
import { FeatureCollection, GeoJsonProperties, Polygon } from 'geojson'
import { useMemo } from 'react'

import udrStyle from '@/modules/map/utils/layer-styles/visitors'
import udrStyle2 from '@/modules/map/utils/layer-styles/visitors2'

type Props = {
  udrData: FeatureCollection<Polygon, GeoJsonProperties>
}

const MapZones = ({ udrData }: Props) => {
  const udrDataByPrice = useMemo(
    () => ({
      regular: {
        ...udrData,
        features: udrData?.features.filter((udr) => udr.properties?.Zakladna_cena !== 2),
      } as FeatureCollection,
      eur2: {
        ...udrData,
        features: udrData?.features.filter((udr) => udr.properties?.Zakladna_cena === 2),
      } as FeatureCollection,
    }),
    [udrData],
  )

  return (
    <>
      {udrDataByPrice.regular?.features?.length > 0 && (
        <ShapeSource id="udrSource" shape={udrDataByPrice.regular}>
          <FillLayer
            id="udrFill"
            style={udrStyle.reduce((prev, current) => ({ ...prev, ...current.paint }), {})}
          />
        </ShapeSource>
      )}
      {udrDataByPrice.eur2?.features?.length > 0 && (
        <ShapeSource id="udrSource2" shape={udrDataByPrice.eur2}>
          <FillLayer
            id="udrFill2"
            style={udrStyle2.reduce((prev, current) => ({ ...prev, ...current.paint }), {})}
          />
        </ShapeSource>
      )}
    </>
  )
}

export default MapZones
