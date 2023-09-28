export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const minutesLeft = minutes % 60

  const hoursPart = hours > 0 ? `${hours} h` : ''
  const minutesPart = hours > 0 && minutesLeft === 0 ? '' : `${minutesLeft} min`

  return `${hoursPart}${hoursPart.length > 0 ? ' ' : ''}${minutesPart}`
}
