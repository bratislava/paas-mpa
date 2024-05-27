import ScreenView from '@/components/screen-layout/ScreenView'
import Markdown from '@/components/shared/Markdown'
import { useTranslation } from '@/hooks/useTranslation'

const MarkdownExample = () => {
  const { t } = useTranslation()

  return (
    <ScreenView>
      <Markdown>{t('Auth.consent')}</Markdown>
    </ScreenView>
  )
}

export default MarkdownExample
