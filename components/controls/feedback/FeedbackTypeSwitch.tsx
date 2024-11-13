import Chip from '@/components/shared/Chip'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { FeedbackType } from '@/modules/backend/openapi-generated'

type Props = {
  value: FeedbackType
  onChange: (value: FeedbackType) => void
}

export const FeedbackTypeSwitch = ({ value, onChange }: Props) => {
  const { t } = useTranslation()

  return (
    <Field label={t('FeedbackScreen.type')}>
      <FlexRow>
        <PressableStyled onPress={() => onChange(FeedbackType.Bug)} className="h-[48px] flex-1">
          <Chip label={t('FeedbackScreen.bug')} isActive={value === FeedbackType.Bug} />
        </PressableStyled>

        <PressableStyled
          onPress={() => onChange(FeedbackType.Improvement)}
          className="h-[48px] flex-1"
        >
          <Chip
            label={t('FeedbackScreen.proposal')}
            isActive={value === FeedbackType.Improvement}
          />
        </PressableStyled>
      </FlexRow>
    </Field>
  )
}
