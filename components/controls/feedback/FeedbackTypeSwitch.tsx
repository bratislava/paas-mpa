import Chip from '@/components/shared/Chip'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'

export type FeedbackType = 'BUG' | 'IMPROVEMENT'

type Props = {
  value: FeedbackType
  onChange: (value: FeedbackType) => void
}

export const FeedbackTypeSwitch = ({ value, onChange }: Props) => {
  const { t } = useTranslation()

  return (
    <Field label={t('FeedbackScreen.type')}>
      <FlexRow>
        <PressableStyled onPress={() => onChange('BUG')} className="h-[48px] flex-1">
          <Chip label={t('FeedbackScreen.bug')} isActive={value === 'BUG'} />
        </PressableStyled>

        <PressableStyled onPress={() => onChange('IMPROVEMENT')} className="h-[48px] flex-1">
          <Chip label={t('FeedbackScreen.proposal')} isActive={value === 'IMPROVEMENT'} />
        </PressableStyled>
      </FlexRow>
    </Field>
  )
}
