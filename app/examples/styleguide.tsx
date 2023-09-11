import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import AvatarShowcase from '@/components/showcases/AvatarShowcase'
import ButtonShowcase from '@/components/showcases/ButtonShowcase'
import ChipShowcase from '@/components/showcases/ChipShowcase'
import DividerShowcase from '@/components/showcases/DividerShowcase'
import FieldShowcase from '@/components/showcases/FieldShowcase'
import IconShowCase from '@/components/showcases/IconShowCase'
import SegmentBadgeShowcase from '@/components/showcases/SegmentBadgeShowcase'
import SurfaceShowcase from '@/components/showcases/SurfaceShowcase'
import TextInputShowcase from '@/components/showcases/TextInputShowcase'
import TypographyShowcase from '@/components/showcases/TypographyShowcase'

const StyleguideScreen = () => (
  <ScrollView className="flex bg-white">
    <TypographyShowcase />
    <TextInputShowcase />
    <FieldShowcase />
    <SurfaceShowcase />
    <DividerShowcase />
    <IconShowCase />
    <SegmentBadgeShowcase />
    <ButtonShowcase />
    <AvatarShowcase />
    <ChipShowcase />
  </ScrollView>
)

export default StyleguideScreen
