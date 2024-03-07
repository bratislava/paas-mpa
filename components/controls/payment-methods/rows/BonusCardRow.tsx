import React from 'react'
import { View } from 'react-native'

import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { clsx } from '@/utils/clsx'
import { formatDate } from '@/utils/formatDate'

/*
 *  Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=3708%3A25139&mode=dev
 */

// Ensure that only one of these props is set at a time
type AdditionalProps =
  | {
      selected?: boolean
      showControlChevron?: never
    }
  | {
      selected?: never
      showControlChevron?: boolean
    }

// TODO this component probably does not need selected/showControlChevron props
type Props = AdditionalProps & {
  balance: string
  validUntil?: string
}

const BonusCardRow = ({ balance, validUntil, selected, showControlChevron }: Props) => {
  const t = useTranslation('PaymentMethods')
  const locale = useLocale()

  return (
    <Panel className={clsx(selected && 'border border-dark')}>
      <View className="g-3">
        <FlexRow>
          <View className="flex-1">
            <Typography variant="default-bold">{t('bonusCard')}</Typography>
            {/* <Typography variant="small">ECV</Typography> */}
          </View>
          {selected && <Icon name="check-circle" />}
          {showControlChevron && <Icon name="expand-more" />}
        </FlexRow>
        <Divider />
        <FlexRow>
          <Typography variant="small">{t('todayRemaining')}</Typography>
          <Typography variant="small-bold">{balance}</Typography>
        </FlexRow>

        {validUntil ? (
          <FlexRow>
            <Typography variant="small">{t('validUntil')}</Typography>
            <Typography variant="small-bold">{formatDate(new Date(validUntil), locale)}</Typography>
          </FlexRow>
        ) : null}
      </View>
    </Panel>
  )
}

export default BonusCardRow
