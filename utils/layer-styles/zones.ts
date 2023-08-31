// eslint-disable-next-line import/extensions
import { colors } from './colors'

const styles = [
  {
    id: 'zones-line',
    type: 'line',
    paint: {
      'line-color': colors.grey,
      'line-opacity': 0.6,
      'line-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        // zoom is 11 (or less) -> circle radius will be 1px
        11,
        2,
        // zoom is 20 (or greater) -> circle radius will be 3px
        20,
        5,
      ],
    },
  },
]

export default styles
