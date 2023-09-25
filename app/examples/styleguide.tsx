import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import AvatarShowcase from '@/components/showcases/AvatarShowcase'
import ButtonShowcase from '@/components/showcases/ButtonShowcase'
import CheckBoxShowcase from '@/components/showcases/CheckBoxShowcase'
import ChipShowcase from '@/components/showcases/ChipShowcase'
import DividerShowcase from '@/components/showcases/DividerShowcase'
import FieldShowcase from '@/components/showcases/FieldShowcase'
import IconShowCase from '@/components/showcases/IconShowCase'
import ListRowsShowcase from '@/components/showcases/ListRowsShowcase'
import ParkingCardsShowcase from '@/components/showcases/ParkingCardsShowcase'
import SegmentBadgeShowcase from '@/components/showcases/SegmentBadgeShowcase'
import SurfaceShowcase from '@/components/showcases/SurfaceShowcase'
import TextInputShowcase from '@/components/showcases/TextInputShowcase'
import TypographyShowcase from '@/components/showcases/TypographyShowcase'

const StyleguideScreen = () => (
  <ScrollView className="flex bg-white">
    <TypographyShowcase />
    <ButtonShowcase />
    <TextInputShowcase />
    <FieldShowcase />
    <SurfaceShowcase />
    <DividerShowcase />
    <CheckBoxShowcase />
    <ListRowsShowcase />
    <IconShowCase />
    <SegmentBadgeShowcase />
    <AvatarShowcase />
    <ChipShowcase />
    <ParkingCardsShowcase />
  </ScrollView>
)

export default StyleguideScreen
