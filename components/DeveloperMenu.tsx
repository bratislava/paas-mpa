import { Link } from 'expo-router'
import React from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

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
    route: '/examples/styleguide',
  },
  {
    title: 'Map',
    subtitle: 'Mapbox & bottom sheet',
    route: '/examples/map',
  },
  {
    title: 'Phone number login/register',
    subtitle: 'Cognito integration',
    route: '/examples/login',
  },
  {
    title: 'Intro',
    subtitle: 'Onboarding screens with swiper after splash screen',
    route: '/intro',
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
    route: '/examples/bottom-sheet',
  },
  {
    title: 'Modal',
    subtitle: 'Modal examples',
    route: '/examples/modal',
  },
  {
    title: 'Purchase',
    subtitle: 'Whole flow of ticket purchase',
    route: '/purchase',
  },
  {
    title: 'Address / zone search screen',
    subtitle:
      'Search by address (places integration) or zone name (be integration) with autocomplete',
    route: '/examples/search',
  },
  {
    title: 'Healthcheck BE',
    subtitle: 'Check if BE is running',
    route: '/examples/healthcheck',
  },
]

const DeveloperMenu = () => {
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
    <FlatList data={menuItems} keyExtractor={(a: MenuItem) => a.title} renderItem={renderRow} />
  )
}

export default DeveloperMenu
