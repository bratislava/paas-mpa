import { IconsEnum } from '../../constants'

const markersStyles = {
  pin: {
    iconImage: ['get', 'icon'],
    iconSize: [
      'interpolate',
      ['linear'],
      ['zoom'],
      // zoom is 5 (or less) -> circle radius will be 1px
      5,
      0.1,
      // zoom is 10 (or greater) -> circle radius will be 5px
      14,
      0.25,
    ],
    iconOpacity: 1,
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
  parkomatCluster: {
    iconImage: IconsEnum.parkomat,
    iconSize: [
      'interpolate',
      ['linear'],
      ['zoom'],
      // zoom is 5 (or less) -> circle radius will be 1px
      5,
      0.1,
      // zoom is 10 (or greater) -> circle radius will be 5px
      14,
      0.25,
    ],
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
  sellingPointCluster: {
    iconImage: IconsEnum.partner,
    iconSize: [
      'interpolate',
      ['linear'],
      ['zoom'],
      // zoom is 5 (or less) -> circle radius will be 1px
      5,
      0.1,
      // zoom is 10 (or greater) -> circle radius will be 5px
      14,
      0.25,
    ],
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
