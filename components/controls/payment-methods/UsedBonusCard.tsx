import BonusCardRow from './rows/BonusCardRow'

type Props = {
  id?: string
  creditUsedSeconds?: number
}

const UsedBonusCard = ({ id, creditUsedSeconds }: Props) => {
  // TODO fetch data as soon as api will be ready
  return id && creditUsedSeconds ? <BonusCardRow balance="balance" validUntil="validUntil" /> : null
}

export default UsedBonusCard
