/* eslint-disable react-native/no-inline-styles */
import { BottomSheetHandle, BottomSheetHandleProps } from '@gorhom/bottom-sheet'
import { Shadow } from 'react-native-shadow-2'

export const HANDLE_HEIGHT = 24

const BottomSheetHandleWithShadow = (props: BottomSheetHandleProps) => {
  return (
    <Shadow
      style={{ alignSelf: 'stretch', bottom: -2 }}
      offset={[0, -12]}
      startColor="#00000008"
      distance={32}
      sides={{
        top: true,
        bottom: false,
        end: false,
        start: false,
      }}
    >
      <BottomSheetHandle
        {...props}
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
      />
    </Shadow>
  )
}

export default BottomSheetHandleWithShadow
