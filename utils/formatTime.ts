export const formatTime = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })
}
