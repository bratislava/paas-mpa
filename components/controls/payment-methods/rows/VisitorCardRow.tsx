import React from 'react'
import { View } from 'react-native'

import AvatarSquare from '@/components/info/AvatarSquare'
import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clsx } from '@/utils/clsx'

/*
 *  Figma:
 *  https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=3230%3A21389&mode=dev
 *  https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=2677%3A22038&mode=dev
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

type Props = AdditionalProps & {
  email: string
  balance: string
}

const VisitorCardRow = ({ email, balance, selected, showControlChevron }: Props) => {
  const t = useTranslation('PaymentMethods')

  return (
    <Panel className={clsx(selected && 'border border-visitorCard')}>
      <FlexRow>
        <View>
          <AvatarSquare variant="visitor-card" />
        </View>
        <View className="flex-1 g-3">
          <FlexRow>
            <View className="flex-1">
              <Typography variant="default-bold">{t('visitorCard')}</Typography>
              <Typography variant="small">{email}</Typography>
            </View>
            {selected && <Icon name="check-circle" />}
            {showControlChevron && <Icon name="expand-more" />}
          </FlexRow>
          <Divider />
          <FlexRow>
            <Typography variant="small">{t('remaining')}</Typography>
            <Typography variant="small-bold">{balance}</Typography>
            {/* <Typography variant="small-bold">48h 30 min / 140h</Typography> */}
          </FlexRow>
        </View>
      </FlexRow>
    </Panel>
  )
}

export default VisitorCardRow
