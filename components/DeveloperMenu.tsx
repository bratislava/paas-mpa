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
        <ListItem key={item.title}>
          <ListItem.Content>
            <ListItem.Title
              style={{
                fontFamily: 'BelfastGrotesk_Black',
              }}
            >
              {item.title}
            </ListItem.Title>
            <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
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
