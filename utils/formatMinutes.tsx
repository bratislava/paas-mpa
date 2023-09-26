export const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const minutesLeft = minutes % 60

  return [
    hours > 0 ? `${hours} h` : '',
    hours > 0 && minutesLeft === 0 ? '' : `${minutesLeft} min`,
  ].join(' ')
}
