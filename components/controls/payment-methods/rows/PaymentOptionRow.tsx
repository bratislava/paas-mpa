import { View } from 'react-native'

import AvatarSquare from '@/components/info/AvatarSquare'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/utils/cn'
// Ensure that only one of these props is set at a time
type AdditionalProps =
  | {
      onContextMenuPress?: () => void
      selected?: never
      showControlChevron?: never
    }
  | {
      onContextMenuPress?: never
      selected?: boolean
      showControlChevron?: never
    }
  | {
      onContextMenuPress?: never
      selected?: never
      showControlChevron?: boolean
    }

type Props = {
  variant: 'payment-card' | 'apple-pay' | 'google-pay'
} & AdditionalProps

const PaymentOptionRow = ({ variant, onContextMenuPress, selected, showControlChevron }: Props) => {
  const { t } = useTranslation()

  // TODO test translations
  const translationsMap = {
    'payment-card': t('PaymentMethods.methods.payment-card'),
    'apple-pay': t('PaymentMethods.methods.apple-pay'),
    'google-pay': t('PaymentMethods.methods.google-pay'),
  } satisfies Record<typeof variant, string>

  return (
    <Panel className={cn('border', selected ? 'border-dark' : 'border-soft')}>
      <FlexRow className="items-center">
        <View className="flex-1 flex-row items-center g-3">
          <AvatarSquare variant={variant} />
          <Typography variant="default-bold">{translationsMap[variant]}</Typography>
        </View>
        {selected && <Icon name="check-circle" />}
        {showControlChevron && <Icon name="expand-more" />}
        {onContextMenuPress ? (
          <View>
            <IconButton
              name="more-vert"
              accessibilityLabel={t('PaymentMethods.openContextMenu')}
              onPress={() => onContextMenuPress()}
            />
          </View>
        ) : null}
      </FlexRow>
    </Panel>
  )
}

export default PaymentOptionRow
