import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

type Props = {
  label: string
  onPress?: () => void
}

const FilterRow = ({ label, onPress }: Props) => (
  <PressableStyled onPress={onPress}>
    <Panel>
      <FlexRow>
        <Typography variant="default-bold" numberOfLines={1} className="shrink text-ellipsis">
          {label}
        </Typography>

        <Icon name="expand-more" />
      </FlexRow>
    </Panel>
  </PressableStyled>
)

export default FilterRow
