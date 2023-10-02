import { useContext, useEffect, useState } from 'react'

import { useArcgisData } from '@/modules/arcgis/hooks/useArcgisData'
import { processData } from '@/modules/map/utils/processData'
import { GlobalStoreContext, MapFeaturesHashMapValue } from '@/state/GlobalStoreProvider'

type ProcessDataReturn = ReturnType<typeof processData>

export const useProcessedArcgisData = () => {
  const [isLoading, setLoading] = useState(true)
  const [markersData, setMarkersData] = useState<ProcessDataReturn['markersData'] | null>(null)
  const [zonesData, setZonesData] = useState<ProcessDataReturn['zonesData'] | null>(null)
  const [udrData, setUdrData] = useState<ProcessDataReturn['udrData'] | null>(null)
  const [odpData, setOdpData] = useState<ProcessDataReturn['odpData'] | null>(null)

  const { setMapFeatures } = useContext(GlobalStoreContext)

  const {
    rawZonesData,
    rawAssistantsData,
    rawParkomatsData,
    rawPartnersData,
    rawParkingLotsData,
    rawBranchesData,
    rawUdrData,
    rawOdpData,
  } = useArcgisData()

  useEffect(() => {
    if (
      rawAssistantsData &&
      rawParkomatsData &&
      rawPartnersData &&
      rawParkingLotsData &&
      rawBranchesData &&
      rawUdrData &&
      rawOdpData &&
      rawZonesData
    ) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { markersData, udrData, odpData, zonesData } = processData({
        rawZonesData,
        rawAssistantsData,
        rawParkomatsData,
        rawPartnersData,
        rawParkingLotsData,
        rawBranchesData,
        rawUdrData,
        rawOdpData,
      })
      setMarkersData(markersData)
      setZonesData(zonesData)
      setUdrData(udrData)
      setOdpData(odpData)
      setLoading(false)

      const featuresHashMap = new Map<number, MapFeaturesHashMapValue>()
      udrData.features.forEach((feature) => {
        if (feature.properties) {
          featuresHashMap.set(feature.properties.OBJECTID, feature)
        }
      })
      markersData.features.forEach((feature) => {
        if (feature.properties) {
          featuresHashMap.set(feature.properties.OBJECTID, feature)
        }
      })
      setMapFeatures(featuresHashMap)
    }
  }, [
    rawAssistantsData,
    rawParkomatsData,
    rawPartnersData,
    rawParkingLotsData,
    rawBranchesData,
    rawUdrData,
    rawOdpData,
    rawZonesData,
    setMapFeatures,
  ])

  return { isLoading, markersData, zonesData, udrData, odpData }
}
