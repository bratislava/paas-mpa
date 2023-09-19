import { ListItem } from '@rneui/themed'
import { Link } from 'expo-router'
import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'

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
    title: 'Onboarding',
    subtitle: 'Onboarding screens with swiper',
    route: '/onboarding/intro',
  },
  {
    title: 'Add parking cards',
    subtitle: 'Flow for adding parking cards',
    route: '/add-parking-cards/enter-email-addresses',
  },
  {
    title: 'Add vehicle',
    subtitle: 'Flow for adding new vehicle',
    route: '/vehicles',
  },
  {
    title: 'Bottom sheet',
    subtitle: 'Bottom sheet examples',
    route: '/examples/bottom-sheet',
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
    title: 'Swiper / Promo',
    subtitle: 'The first screen on inial startup after splash screen',
    route: '/examples/swiper',
  },
  {
    title: 'Info screen',
    subtitle: 'Large icon, title, description and cofirm (optional reject?) button',
    route: '/examples/info',
  },
  {
    title: 'TODO more',
    subtitle: 'Feel free to add to this list',
    route: '/index',
  },
]

const DeveloperMenu = () => {
  const renderRow = ({ item }: { item: MenuItem }) => (
    <Link href={item.route} asChild>
      <TouchableOpacity>
        <ListItem key={item.title} className="border-b-px border-divider">
          <ListItem.Content>
            <ListItem.Title className="font-semibold">{item.title}</ListItem.Title>
            <ListItem.Subtitle className="pt-1">{item.subtitle}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>
    </Link>
  )

  return (
    <FlatList data={menuItems} keyExtractor={(a: MenuItem) => a.title} renderItem={renderRow} />
  )
}

export default DeveloperMenu
