/* eslint-disable sonarjs/no-duplicate-string */
import React, { Fragment } from 'react'
import { View } from 'react-native'

import ActionRow, { ActionRowProps } from '@/components/list-rows/ActionRow'
import ListRow, { ListRowProps } from '@/components/list-rows/ListRow'
import Divider from '@/components/shared/Divider'
import PressableStyled from '@/components/shared/PressableStyled'

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
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>
            {index !== 0 && <Divider />}
            <ListRow {...item} />
          </Fragment>
        ))}
      </View>

      <View>
        {dataActionRows.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>
            {index !== 0 && <Divider />}
            <PressableStyled>
              <ActionRow {...item} />
            </PressableStyled>
          </Fragment>
        ))}
      </View>
    </View>
  )
}

export default ListRowsShowcase
