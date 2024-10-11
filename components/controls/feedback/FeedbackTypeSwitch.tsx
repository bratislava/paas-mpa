import Chip from '@/components/shared/Chip'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  value: 'bug' | 'proposal'
  onChange: (value: 'bug' | 'proposal') => void
}

export const FeedbackTypeSwitch = ({ value, onChange }: Props) => {
  const { t } = useTranslation()

  return (
    <Field label={t('FeedbackScreen.type')}>
      <FlexRow>
        <PressableStyled onPress={() => onChange('bug')} className="h-[48px] flex-1">
          <Chip label={t('FeedbackScreen.bug')} isActive={value === 'bug'} />
        </PressableStyled>
        <PressableStyled onPress={() => onChange('proposal')} className="h-[48px] flex-1">
          <Chip label={t('FeedbackScreen.proposal')} isActive={value === 'proposal'} />
        </PressableStyled>
      </FlexRow>
    </Field>
  )
}
