import { parse } from 'tinyduration'

// TODO make this function more reliable
export const formatPeriodOfTime = (periodOfTime: string | undefined | null) => {
  if (!periodOfTime) {
    return ''
  }

  try {
    const durationObj = parse(periodOfTime)

    const hours =
      (durationObj.hours ?? 0) + (durationObj.days ?? 0) * 24 + (durationObj.weeks ?? 0) * 24 * 7
    const { minutes, seconds } = durationObj

    // eslint-disable-next-line sonarjs/no-nested-template-literals
    return `${hours ? `${hours}h` : ''} ${minutes ? `${minutes}min` : ''} ${
      seconds ? `${seconds}s` : ''
    }`.trim()
  } catch (error) {
    console.log(error)
  }

  return ''
}
