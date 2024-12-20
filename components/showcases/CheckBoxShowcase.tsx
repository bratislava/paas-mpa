import React, { useState } from 'react'
import { View } from 'react-native'

import SelectRow from '@/components/list-rows/SelectRow'
import CheckBox from '@/components/shared/CheckBox'
import Typography from '@/components/shared/Typography'

const CheckBoxShowcase = () => {
  const [checked, setChecked] = useState(false)

  // TODO checkbox group
  // const dataSelectRows: SelectRowProps[] = [
  //   { id: 1, label: 'Select name' },
  //   { id: 2, label: 'Select name' },
  //   { id: 3, label: 'Select name' },
  // ]

  return (
    <View className="p-4 g-4">
      <View className="flex-row g-3">
        <CheckBox value={checked} onChange={setChecked} />
        <Typography>Controlled {checked ? 'checked' : 'unchecked'}</Typography>
      </View>
      <SelectRow
        label={checked ? 'Checked' : 'Unchecked'}
        onValueChange={setChecked}
        value={checked}
      />

      {/* <List data={dataSelectRows} renderItem={({ item }) => <SelectRow {...item} />} /> */}
    </View>
  )
}

export default CheckBoxShowcase
