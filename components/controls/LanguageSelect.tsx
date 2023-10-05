import React from 'react'
import { useMMKVString } from 'react-native-mmkv'

import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { STORAGE_LANGUAGE_KEY } from '@/utils/langueDetectorPlugin'

const LanguageSelect = () => {
  const t = useTranslation('Settings')

  const [mmkvLocale] = useMMKVString(STORAGE_LANGUAGE_KEY)

  const language = (mmkvLocale && { sk: 'Slovenčina', en: 'English' }[mmkvLocale]) ?? t('system')

  return (
    <Panel className="border border-divider bg-white py-3">
      <FlexRow>
        <Typography>{language}</Typography>
        <Icon name="expand-more" />
      </FlexRow>
    </Panel>
  )
}

export default LanguageSelect
