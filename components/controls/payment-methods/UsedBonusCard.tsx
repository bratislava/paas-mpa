import { formatBalance } from '@/utils/formatBalance'

import BonusCardRow from './rows/BonusCardRow'

type Props = {
  id?: string
  creditUsedSeconds?: number
  creditBpkRemaining?: number
  validUntil?: string
}

const BPK_ORIGINAL_SECONDS = 7200

const UsedBonusCard = ({ id, creditUsedSeconds, validUntil, creditBpkRemaining }: Props) => {
  return id && creditUsedSeconds ? (
    <BonusCardRow
      balance={formatBalance((creditBpkRemaining || 0) + creditUsedSeconds, BPK_ORIGINAL_SECONDS)}
      validUntil={validUntil}
    />
  ) : null
}

export default UsedBonusCard
