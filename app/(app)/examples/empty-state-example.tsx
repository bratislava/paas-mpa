import React from 'react'

import ContinueButton from '@/components/navigation/ContinueButton'
import EmptyStateScreen from '@/components/screen-layout/EmptyStateScreen'

const EmptyStateExampleScreen = () => (
  <EmptyStateScreen
    contentTitle="No entities"
    text="This is an empty state with quite long text to see how it looks like."
    actionButton={<ContinueButton />}
    actionButtonPosition="insideContent"
  />
)

export default EmptyStateExampleScreen
