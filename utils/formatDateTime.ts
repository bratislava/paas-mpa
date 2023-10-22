const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

export const formatDateTime = (date: Date, locale: string) => {
  const weekday = capitalize(
    date
      .toLocaleDateString(locale, {
        weekday: 'short',
      })
      .split(' ')[0]
      .replace(',', ''),
  )

  return `${weekday}, ${date.toLocaleDateString(locale, {
    minute: '2-digit',
    hour: 'numeric',
    day: 'numeric',
    month: 'short',
  })}`
}
