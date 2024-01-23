// eslint-disable-next-line import/extensions
import { colors } from './colors'

export const udrStyles = {
  lineActive: {
    lineColor: ['case', ['>=', ['get', 'price'], 2], colors.green2, colors.lawnGreen],
    lineDasharray: [1, 0],
    lineWidth: ['interpolate', ['linear'], ['zoom'], 11, 1, 20, 3],
    lineOpacity: 0.4,
  },
  linePlanned: {
    lineColor: ['case', ['>=', ['get', 'price'], 2], colors.green2, colors.lawnGreen],
    lineDasharray: [2, 2],
    lineWidth: ['interpolate', ['linear'], ['zoom'], 11, 1, 20, 3],
    lineOpacity: 0.4,
  },
  lineSelected: {
    lineColor: colors.orange,
    lineDasharray: [1, 0],
    lineWidth: ['interpolate', ['linear'], ['zoom'], 11, 1, 20, 3],
    lineOpacity: 0.4,
  },
  zoneFill: {
    fillColor: ['case', ['>=', ['get', 'price'], 2], colors.green2, colors.lawnGreen],
    fillOpacity: ['case', ['boolean', ['feature-state', 'hover'], false], 0.4, 0.2],
  },
  zoneFillSelected: {
    fillColor: colors.orange,
    fillOpacity: 0.4,
  },
}
