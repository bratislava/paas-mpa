import { View } from 'react-native'

import FloatingButton from '@/components/shared/FloatingButton'

const FloatingButtonShowcase = () => {
  return (
    <View className="flex-row flex-wrap p-4 g-4">
      <FloatingButton startIcon="more-vert">Default</FloatingButton>
      <FloatingButton startIcon="more-vert" disabled>
        Disabled
      </FloatingButton>
    </View>
  )
}

export default FloatingButtonShowcase
