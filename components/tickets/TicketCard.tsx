import React from 'react'
import { View } from 'react-native'

import SegmentBadge from '@/components/info/SegmentBadge'
import Button from '@/components/shared/Button'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'

/*
 *  Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=2739%3A22754&mode=dev
 */

// TODO props
const TicketCard = () => {
  return (
    <Panel className="border border-divider bg-white">
      <View className="g-4">
        <FlexRow>
          <Typography variant="default-bold">Datetime – Datetime</Typography>
          {/* TODO translation */}
          <IconButton name="more-vert" accessibilityLabel="More" />
        </FlexRow>
        <View className="items-start g-1">
          <SegmentBadge label="1234" />
          <Typography variant="small">Zone name</Typography>
          <Typography variant="small">Licence plate number</Typography>
        </View>
        <View className="g-2">
          <Button>Prolong ticket</Button>
          <Button variant="secondary">Terminate ticket</Button>
        </View>
      </View>
    </Panel>
  )
}

export default TicketCard
