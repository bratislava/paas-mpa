import { IconsEnum } from '@/modules/map/constants'

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

const markersStyles = {
  pin: {
    iconImage: ['get', 'icon'],
    iconSize,
    iconOpacity: 1,
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
  parkomatCluster: {
    iconImage: IconsEnum.parkomat,
    iconSize,
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
  sellingPointCluster: {
    iconImage: IconsEnum.partner,
    iconSize,
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
  clusterCount: {
    textField: ['get', 'point_count_abbreviated'],
    textColor: '#fff',
    textOffset: [1, -1],
    textHaloColor: '#f00',
    textHaloWidth: 5,
  },
}

export default markersStyles
