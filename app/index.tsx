import { Link } from 'expo-router'
import { View } from 'react-native'

import Button from '@/components/shared/Button'

const IndexScreen = () => (
  <View className="flex-1 p-4 font-belfast">
    {/* <DeveloperMenu /> */}
    <Link href="/dev" asChild>
      <Button>Developer menu</Button>
    </Link>
  </View>
)

export default IndexScreen
