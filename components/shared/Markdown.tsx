import MarkdownNative, { RenderRules } from 'react-native-markdown-display'

import Typography from '@/components/shared/Typography'

const rules: RenderRules = {
  paragraph: (node, children) => (
    <Typography key={node.key} variant="small">
      {children}
    </Typography>
  ),
  strong: (node, children) => (
    <Typography key={node.key} variant="small-bold">
      {children}
    </Typography>
  ),
}

type Props = {
  children: string
}

const Markdown = ({ children }: Props) => {
  return <MarkdownNative rules={rules}>{children}</MarkdownNative>
}

export default Markdown
