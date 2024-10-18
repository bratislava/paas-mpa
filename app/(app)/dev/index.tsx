import { Link } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'

import { List } from '@/components/shared/List/List'
import Typography from '@/components/shared/Typography'

type MenuItem = {
  title: string
  subtitle: string
  route: string
}

const menuItems: MenuItem[] = [
  {
    title: 'Styleguide',
    subtitle: 'Typography & UI components sandbox',
    route: '/dev/examples/styleguide',
  },
  {
    title: 'Phone number login/register',
    subtitle: 'Cognito integration',
    route: '/sign-in',
  },
  {
    title: 'User',
    subtitle: 'Cognito user info',
    route: '/dev/examples/user',
  },
  {
    title: 'Onboarding',
    subtitle: 'Onboarding screens with swiper after splash screen',
    route: '/onboarding',
  },
  {
    title: 'Permissions',
    subtitle: 'Permissions screens',
    route: '/permissions',
  },
  {
    title: 'Parking cards',
    subtitle: 'All parking cards + flow for adding cards',
    route: '/parking-cards',
  },
  {
    title: 'Vehicles',
    subtitle: 'List and manage vehicles',
    route: '/vehicles',
  },
  {
    title: 'Add vehicle modal',
    subtitle: 'Adding new vehicle from different screen',
    route: '/vehicles/add-vehicle',
  },
  {
    title: 'Bottom sheet',
    subtitle: 'Bottom sheet examples',
    route: '/dev/examples/bottom-sheet-example',
  },
  {
    title: 'Modal',
    subtitle: 'Modal examples',
    route: '/dev/examples/modal-example',
  },
  {
    title: 'Snackbar',
    subtitle: 'Snackbar examples',
    route: '/dev/examples/snackbar-example',
  },
  {
    title: 'Code input',
    subtitle: 'Code input examples',
    route: '/dev/examples/codeinput-example',
  },
  {
    title: 'Purchase',
    subtitle: 'Whole flow of ticket purchase',
    route: '/purchase',
  },
  {
    title: 'Healthcheck BE',
    subtitle: 'Check if BE is running',
    route: '/dev/examples/healthcheck',
  },
  {
    title: 'Envs',
    subtitle: 'Env values',
    route: '/dev/examples/loaded-envs',
  },
  {
    title: 'Empty state screen',
    subtitle: 'Centered screen with sad smiley',
    route: '/dev/examples/empty-state-example',
  },
  {
    title: 'Markdown',
    subtitle: 'Markdown examples',
    route: '/dev/examples/markdown-example',
  },
]

const DevScreen = () => {
  const renderRow = ({ item }: { item: MenuItem }) => (
    <Link key={item.title} href={item.route} asChild>
      <TouchableOpacity>
        <View key={item.title} className="border-b-px border-divider p-3">
          <Typography variant="h2">{item.title}</Typography>
          <Typography>{item.subtitle}</Typography>
        </View>
      </TouchableOpacity>
    </Link>
  )

  return (
    <View className="flex-1 items-stretch">
      <List data={menuItems} keyExtractor={(a: MenuItem) => a.title} renderItem={renderRow} />
    </View>
  )
}

export default DevScreen
