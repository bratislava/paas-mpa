const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a))
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x))

/** Interpolate the value `a` from the first range to a value in the second range
 * https://www.trysmudford.com/blog/linear-interpolation-functions/
 */
export const interpolate = (a: number, [x1, y1]: [number, number], [x2, y2]: [number, number]) =>
  lerp(x2, y2, invlerp(x1, y1, a))
