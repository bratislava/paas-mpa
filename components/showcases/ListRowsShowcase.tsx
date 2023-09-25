/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react'
import { FlatList, View } from 'react-native'

import ActionRow, { ActionRowProps } from '@/components/actions/ActionRow'
import ListRow, { ListRowProps } from '@/components/actions/ListRow'
import SelectRow, { SelectRowProps } from '@/components/actions/SelectRow'

const ListRowsShowcase = () => {
  const dataListRows: ListRowProps[] = [
    { label: 'Item name', icon: 'language' },
    { label: 'Item name', icon: 'language' },
    { label: 'Item name', icon: 'language' },
  ]

  const dataActionRows: ActionRowProps[] = [
    { label: 'Action name', startIcon: 'language' },
    { label: 'Action name', endIcon: 'language' },
    { label: 'Action name', endIcon: 'logout', variant: 'negative' },
  ]

  const dataSelectRows: SelectRowProps[] = [
    { label: 'Select name' },
    { label: 'Select name' },
    { label: 'Select name' },
  ]

  return (
    <View className="p-4 g-4">
      <FlatList data={dataListRows} renderItem={({ item }) => <ListRow {...item} />} />

      <FlatList data={dataActionRows} renderItem={({ item }) => <ActionRow {...item} />} />

      <FlatList data={dataSelectRows} renderItem={({ item }) => <SelectRow {...item} />} />
    </View>
  )
}

export default ListRowsShowcase
