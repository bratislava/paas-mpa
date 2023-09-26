/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react'
import { View } from 'react-native'

import ActionRow, { ActionRowProps } from '@/components/actions/ActionRow'
import ListRow, { ListRowProps } from '@/components/actions/ListRow'
import Divider from '@/components/shared/Divider'

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

  return (
    <View className="p-4 g-4">
      <View>
        {dataListRows.map((item, index) => (
          <>
            {index !== 0 && <Divider />}
            {/* eslint-disable-next-line react/no-array-index-key */}
            <ListRow key={index} {...item} />
          </>
        ))}
      </View>

      <View>
        {dataActionRows.map((item, index) => (
          <>
            {index !== 0 && <Divider />}
            {/* eslint-disable-next-line react/no-array-index-key */}
            <ActionRow key={index} {...item} />
          </>
        ))}
      </View>
    </View>
  )
}

export default ListRowsShowcase
