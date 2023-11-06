import { formatDuration } from '@/utils/formatDuration'

export const formatBalance = (balance: number, originalBalance?: number) => {
  const balanceString = formatDuration(balance)
  const originalBalanceString = originalBalance ? ` / ${formatDuration(originalBalance)}` : ''

  return `${balanceString}${originalBalanceString}`
}
