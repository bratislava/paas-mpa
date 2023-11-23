import clsx from 'clsx'
import { Link } from 'expo-router'
import { useMemo } from 'react'
import MarkdownNative, { RenderRules } from 'react-native-markdown-display'

import Typography from '@/components/shared/Typography'

type FontSize = 'default' | 'small'

const getRules = (fontSize: FontSize, textCenter?: boolean): RenderRules => ({
  body: (node, children) => (
    <Typography key={node.key} variant={fontSize} className={clsx(textCenter && 'text-center')}>
      {children}
    </Typography>
  ),
  paragraph: (node, children) => (
    <Typography key={node.key} variant={fontSize}>
      {children}
    </Typography>
  ),
  strong: (node, children) => (
    <Typography key={node.key} variant={`${fontSize}-bold`}>
      {children}
    </Typography>
  ),
  link: (node, children) => (
    <Link key={node.key} href={node.attributes.href}>
      <Typography variant={`${fontSize}-bold`} className="underline">
        {children}
      </Typography>
    </Link>
  ),
})

type Props = {
  children: string
  fontSize?: FontSize
  textCenter?: boolean
}

const Markdown = ({ children, fontSize = 'default', textCenter }: Props) => {
  const rules = useMemo(() => getRules(fontSize, textCenter), [fontSize, textCenter])

  return <MarkdownNative rules={rules}>{children}</MarkdownNative>
}

export default Markdown
