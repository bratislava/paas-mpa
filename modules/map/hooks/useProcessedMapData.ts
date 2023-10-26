import { useEffect, useState } from 'react'

import { useArcgisData } from '@/modules/arcgis/hooks/useArcgisData'
import { processData } from '@/modules/map/utils/processData'
import { MapZoneHashMapValue } from '@/state/MapProvider/types'
import { useMapContext } from '@/state/MapProvider/useMapContext'

type ProcessDataReturn = ReturnType<typeof processData>

export type ProcessedMapData = Omit<ReturnType<typeof useProcessedArcgisData>, 'isLoading'>

export const useProcessedArcgisData = () => {
  const [isLoading, setLoading] = useState(true)
  const [markersData, setMarkersData] = useState<ProcessDataReturn['markersData'] | null>(null)
  const [zonesData, setZonesData] = useState<ProcessDataReturn['zonesData'] | null>(null)
  const [udrData, setUdrData] = useState<ProcessDataReturn['udrData'] | null>(null)
  const [odpData, setOdpData] = useState<ProcessDataReturn['odpData'] | null>(null)

  const { setMapZones } = useMapContext()

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

      const featuresHashMap = new Map<string, MapZoneHashMapValue>()
      udrData.features.forEach((feature) => {
        if (feature.properties) {
          featuresHashMap.set(feature.properties.UDR_ID.toString(), feature)
        }
      })
      setMapZones(featuresHashMap)
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
    setMapZones,
  ])

  return { isLoading, markersData, zonesData, udrData, odpData }
}
