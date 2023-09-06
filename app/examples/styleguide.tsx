import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import AvatarIconShowcase from '@/components/showcases/AvatarIconShowcase'
import ButtonShowcase from '@/components/showcases/ButtonShowcase'
import FieldShowcase from '@/components/showcases/FieldShowcase'
import IconShowCase from '@/components/showcases/IconShowCase'
import SegmentBadgeShowcase from '@/components/showcases/SegmentBadgeShowcase'
import SurfaceShowcase from '@/components/showcases/SurfaceShowcase'
import TextInputShowcase from '@/components/showcases/TextInputShowcase'
import TypographyShowcase from '@/components/showcases/TypographyShowcase'

const StyleguideScreen = () => (
  <ScrollView className="bg-white">
    <TypographyShowcase />
    <TextInputShowcase />
    <FieldShowcase />
    <SurfaceShowcase />
    <IconShowCase />
    <ButtonShowcase />
    <AvatarIconShowcase />
    <SegmentBadgeShowcase />
  </ScrollView>
)

export default StyleguideScreen
