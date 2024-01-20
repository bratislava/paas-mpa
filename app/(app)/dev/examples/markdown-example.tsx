import ScreenView from '@/components/screen-layout/ScreenView'
import Markdown from '@/components/shared/Markdown'
import { useTranslation } from '@/hooks/useTranslation'

const MarkdownExample = () => {
  const t = useTranslation('Auth')

  return (
    <ScreenView>
      <Markdown>{t('consent')}</Markdown>
    </ScreenView>
  )
}

export default MarkdownExample
