import React from 'react'

import FlexRow from '@/components/shared/FlexRow'
import Typography from '@/components/shared/Typography'

type Props = {
  description: string
  value: string
}

const CardContentItem = ({ description, value }: Props) => {
  return (
    <FlexRow>
      <Typography variant="small">{description}</Typography>
      <Typography variant="small-bold">{value}</Typography>
    </FlexRow>
  )
}

export default CardContentItem
