export const formatDateTime = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale, {
    minute: '2-digit',
    hour: 'numeric',
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  })
}
