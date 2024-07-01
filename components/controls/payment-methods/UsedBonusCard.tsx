import { formatBalance } from '@/utils/formatBalance'

import BonusCardRow from './rows/BonusCardRow'

// TODO check what props should really be optional
type Props = {
  creditUsedSeconds: number
  creditBpkRemaining?: number
  validUntil?: string
}

const BPK_ORIGINAL_SECONDS = 7200

const UsedBonusCard = ({ creditUsedSeconds, validUntil, creditBpkRemaining }: Props) => {
  return (
    <BonusCardRow
      balance={formatBalance((creditBpkRemaining ?? 0) + creditUsedSeconds, BPK_ORIGINAL_SECONDS)}
      validUntil={validUntil}
    />
  )
}

export default UsedBonusCard
