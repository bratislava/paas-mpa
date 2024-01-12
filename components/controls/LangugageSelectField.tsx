import { Link } from 'expo-router'
import { useEffect } from 'react'
import { useTranslation as useLibTranslation } from 'react-i18next'

import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { settingsOptions } from '@/modules/backend/constants/queryOptions'

const LangugageSelectField = () => {
  const t = useTranslation('Settings')
  const { i18n } = useLibTranslation()

  const { data, isPending, isRefetching } = useQueryWithFocusRefetch(settingsOptions())

  useEffect(() => {
    if (data?.data.language && data.data.language !== i18n.language) {
      i18n.changeLanguage(data?.data.language)
    }
  }, [data?.data.language, i18n])

  const languages = { sk: 'Slovenčina', en: 'English' }

  return (
    <Field label={t('language')}>
      <Link asChild href="/settings/language">
        <PressableStyled disabled={isPending || isRefetching}>
          <Panel className="border border-divider bg-white py-3">
            <FlexRow>
              <Typography>{languages[data?.data.language as 'sk' | 'en']}</Typography>
              <Icon name="expand-more" />
            </FlexRow>
          </Panel>
        </PressableStyled>
      </Link>
    </Field>
  )
}

export default LangugageSelectField
