import React from 'react'

import ContinueButton from '@/components/navigation/ContinueButton'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'

const EmptyStateExampleScreen = () => (
  <EmptyStateScreen
    title="No entities"
    text="This is an empty state with quite long text to see how it looks like."
    button={<ContinueButton />}
    buttonPosition="insideContent"
  />
)

export default EmptyStateExampleScreen
