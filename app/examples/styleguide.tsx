import React from 'react'
import { Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import AvatarIconShowcase from '@/components/showcases/AvatarIconShowcase'
import ButtonShowcase from '@/components/showcases/ButtonShowcase'
import IconShowCase from '@/components/showcases/IconShowCase'
import SegmentBadgeShowcase from '@/components/showcases/SegmentBadgeShowcase'

const StyleguideScreen = () => (
  <ScrollView>
    <View>
      <Text className="text-gray-400">TODO</Text>
    </View>
    <IconShowCase />
    <ButtonShowcase />
    <AvatarIconShowcase />
    <SegmentBadgeShowcase />
  </ScrollView>
)

export default StyleguideScreen
