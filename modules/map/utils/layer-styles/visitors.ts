// eslint-disable-next-line import/extensions
import { colors } from './colors'

const styles = [
  {
    id: 'udr-line-active',
    type: 'line',
    paint: {
      lineColor: ['case', ['>=', ['get', 'Zakladna_cena'], 2], colors.green2, colors.lawnGreen],
      lineDasharray: [1, 0],
      lineWidth: ['interpolate', ['linear'], ['zoom'], 11, 1, 20, 3],
      lineOpacity: 0.4,
    },
  },
  {
    id: 'udr-line-planned',
    type: 'line',
    paint: {
      lineColor: ['case', ['>=', ['get', 'Zakladna_cena'], 2], colors.green2, colors.lawnGreen],
      lineDasharray: [2, 2],
      lineWidth: ['interpolate', ['linear'], ['zoom'], 11, 1, 20, 3],
      lineOpacity: 0.4,
    },
  },
  {
    id: 'udr-line-selected',
    type: 'line',
    paint: {
      lineColor: colors.orange,
      lineDasharray: [1, 0],
      lineWidth: ['interpolate', ['linear'], ['zoom'], 11, 1, 20, 3],
      lineOpacity: 0.4,
    },
  },
  {
    id: 'udr-fill',
    type: 'fill',
    paint: {
      fillColor: ['case', ['>=', ['get', 'Zakladna_cena'], 2], colors.green2, colors.lawnGreen],
      fillOpacity: ['case', ['boolean', ['feature-state', 'hover'], false], 0.4, 0.2],
    },
  },
  {
    id: 'udr-fill-selected',
    type: 'fill',
    paint: {
      fillColor: colors.orange,
      fillOpacity: 0.4,
    },
  },
]

export default styles
