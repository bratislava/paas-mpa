import { Feature, FeatureCollection } from 'geojson'
import { useEffect, useState } from 'react'

import {
  Attachment,
  fetchAllFromArcgis,
  fetchAttachmentsFromArcgis,
  IUseArcgisOptions,
} from '../arcgisUtils'

export const useArcgis = (url: string | string[], options?: IUseArcgisOptions) => {
  const [data, setData] = useState<FeatureCollection | null>(null)
  useEffect(() => {
    console.log('Refetching data')
    if (Array.isArray(url)) {
      Promise.all(url.map((u) => fetchAllFromArcgis(u, options))).then((results) => {
        setData({
          type: 'FeatureCollection',
          features: results.reduce(
            (features, result) => [...features, ...result.features],
            [] as Feature[],
          ),
        })
      })
    } else {
      fetchAllFromArcgis(url, options).then((fetchedData) => {
        setData(fetchedData)
      })
    }
  }, [url, options])

  return {
    data,
  }
}

export const useArcgisAttachments = (url: string, objectId: string | number | null) => {
  const [data, setData] = useState<Attachment[] | null>(null)

  useEffect(() => {
    setData(null)
    if (objectId) {
      fetchAttachmentsFromArcgis(url, objectId).then((fetchedData) => {
        setData(fetchedData)
      })
    }
  }, [url, objectId])

  return { data }
}
