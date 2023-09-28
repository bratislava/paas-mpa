// eslint-disable-next-line import/extensions
import { colors } from './colors'

const styles = [
  {
    id: 'udr-line2',
    type: 'line',
    paint: {
      fillOutlineColor: [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        colors.orange,
        colors.green2,
      ],
      // lineDasharray: [
      //   'match',
      //   ['get', 'Status'],
      //   'planned',
      //   ['literal', [2, 2]],
      //   ['literal', [1, 0]],
      // ],
      // lineWidth: [
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
    id: 'udr-fill2',
    type: 'fill',
    paint: {
      fillColor: [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        colors.orange,
        colors.green2,
      ],
      fillOpacity: ['case', ['boolean', ['feature-state', 'hover'], false], 0.4, 0.2],
    },
  },
]

export default styles
