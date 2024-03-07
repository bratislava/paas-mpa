import { Link } from 'expo-router'
import { useMemo } from 'react'
import { Text, View } from 'react-native'
import MarkdownNative, { hasParents, MarkdownIt, RenderRules } from 'react-native-markdown-display'

import Typography from '@/components/shared/Typography'
import { clsx } from '@/utils/clsx'

type FontSize = 'default' | 'small'

const getRules = (fontSize: FontSize, textCenter?: boolean): RenderRules => ({
  body: (node, children) => <View key={node.key}>{children}</View>,
  paragraph: (node, children) => (
    <Typography key={node.key} variant={fontSize} className={clsx(textCenter && 'text-center')}>
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
  // Solution by: https://github.com/iamacup/react-native-markdown-display/issues/49#issuecomment-1336334137
  html_inline: (node, children, parent) => {
    // we check that the parent array contans a td because <br> in paragraph setting will create a html_inlinde surrounded by a soft break, try removing the clause to see what happens (double spacing on the <br> between 'top one' and 'bottom one')
    if (node.content.trim() === '<br>' && hasParents(parent, 'td')) {
      return <Text key={node.key}>{'\n'}</Text>
    }

    return null
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const markdownInstance = new MarkdownIt({ typographer: true, breaks: true, html: true })

const pushBr = (str: string) => {
  return str
    .split('\n')
    .map((e) => {
      if (e === '') return '<br>'

      return e
    })
    .join('\n')
}

type Props = {
  children: string
  fontSize?: FontSize
  textCenter?: boolean
}

const Markdown = ({ children, fontSize = 'default', textCenter }: Props) => {
  const rules = useMemo(() => getRules(fontSize, textCenter), [fontSize, textCenter])

  return (
    <MarkdownNative rules={rules} markdownit={markdownInstance} debugPrintTree>
      {pushBr(children)}
    </MarkdownNative>
  )
}

export default Markdown
