import { MapPointIconEnum } from '@/modules/map/constants'

const iconSize = [
  'interpolate',
  ['linear'],
  ['zoom'],
  // zoom is 10 (or less) -> size will be 0.1
  10,
  0.1,
  // zoom is 14 (or greater) -> size will be 0.25
  14,
  0.25,
]

const clusterTextOffset = ['interpolate', ['linear'], ['zoom'], 10, [0.6, -0.6], 14, [0.85, -0.85]]
const clusterIconOffset = ['interpolate', ['linear'], ['zoom'], 10, [40, -40], 14, [50, -50]]

export const markersStyles = {
  pin: {
    iconImage: ['get', 'icon'],
    iconSize,
    iconOpacity: 1,
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
  parkomatCluster: {
    iconImage: MapPointIconEnum.parkomat,
    iconSize,
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
  sellingPointCluster: {
    iconImage: MapPointIconEnum.partner,
    iconSize,
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
    iconOpacity: 1,
  },
  clusterCount: {
    iconImage: 'clusterCircle',
    iconSize,
    iconOffset: clusterIconOffset,
    textField: ['get', 'point_count_abbreviated'],
    textColor: '#fff',
    textOffset: clusterTextOffset,
    textSize: ['interpolate', ['linear'], ['zoom'], 10, 6, 14, 15],
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
    iconOpacity: 1,
  },
}
