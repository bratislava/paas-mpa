import { View } from 'react-native'

import { CommonPaymentTypeProps } from '@/components/controls/payment-methods/rows/PaymentOptionRow'
import AvatarSquare, { AvatarSquareProps } from '@/components/info/AvatarSquare'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import IconButton from '@/components/shared/IconButton'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/utils/cn'

type Props = {
  variant: AvatarSquareProps['variant']
  title: string
} & CommonPaymentTypeProps

const PaymentOptionContent = ({
  variant,
  title,
  onContextMenuPress,
  selected,
  showControlChevron,
}: Props) => {
  const { t } = useTranslation()

  return (
    <Panel className={cn('border', selected ? 'border-dark' : 'border-soft')}>
      <FlexRow className="items-center">
        <View className="flex-1 flex-row items-center g-3">
          <AvatarSquare variant={variant} />

          <Typography variant="default-bold">{title}</Typography>
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

export default PaymentOptionContent
