// eslint-disable-next-line import/extensions
import { colors } from './colors'

const styles = [
  {
    id: 'odp-line',
    type: 'line',
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        colors.orange,
        colors.lightBlue,
      ],
      // 'line-dasharray': [
      //   'match',
      //   ['get', 'Status'],
      //   'planned',
      //   ['literal', [2, 2]],
      //   ['literal', [1, 0]],
      // ],
      // 'line-width': [
      //   'interpolate',
      //   ['linear'],
      //   ['zoom'],
      //   // zoom is 5 (or less) -> circle radius will be 1px
      //   11,
      //   1,
      //   // zoom is 10 (or greater) -> circle radius will be 5px
      //   20,
      //   3,
      // ],
    },
  },
  {
    id: 'odp-fill',
    type: 'fill',
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        colors.orange,
        colors.lightBlue,
      ],
      'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.4, 0.2],
    },
  },
]

export default styles
