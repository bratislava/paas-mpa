import React from 'react'

import EmptyStateScreen from '@/components/layout/EmptyStateScreen'
import ContinueButton from '@/components/navigation/ContinueButton'

const EmptyStateExampleScreen = () => (
  <EmptyStateScreen
    title="No entities"
    text="This is an empty state with quite long text to see how it looks like."
    button={<ContinueButton />}
    buttonPosition="insideContent"
  />
)

export default EmptyStateExampleScreen
