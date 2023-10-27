export const formatDuration = (seconds: number) => {
  const roundedInMinutes = Math.round(seconds / 60)

  // compute whole hours
  const hours = Math.floor(roundedInMinutes / 60)
  // compute residuum in minutes
  const minutesLeft = roundedInMinutes % 60

  const hoursPart = hours > 0 ? `${hours} h` : ''
  const minutesPart = hours > 0 && minutesLeft === 0 ? '' : `${minutesLeft} min`

  return `${hoursPart} ${minutesPart}`.trim()
}
