declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'

  const content: React.FC<SvgProps>
  export default content
}

declare module '*.png' {
  import { ImageSourcePropType } from 'react-native'

  const value: ImageSourcePropType
  export default value
}

// Redeclare react-native-markdown-display types to add a missing prop: children
export * from 'react-native-markdown-display'

declare module 'react-native-markdown-display' {
  export interface MarkdownProps {
    rules?: RenderRules
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: StyleSheet.NamedStyles<any>
    renderer?: AstRenderer
    markdownit?: MarkdownIt
    mergeStyle?: boolean
    debugPrintTree?: boolean
    onLinkPress?: (url: string) => boolean
    children: string
  }
}
