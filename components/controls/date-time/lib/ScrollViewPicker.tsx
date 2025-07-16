/* eslint-disable no-underscore-dangle,sonarjs/cognitive-complexity */
import React, {
  type JSX,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import Typography from '@/components/shared/Typography'

/* Inspired by po-meste-native: https://github.com/bratislava/po-meste-native/blob/master/vendor/react-native-wheel-scrollview-picker/ScrollViewPicker.tsx
 * Read ts docs below for more info.
 */

function isNumeric(str: unknown): boolean {
  if (typeof str === 'number') return true
  if (typeof str !== 'string') return false

  return (
    !Number.isNaN(str as unknown as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !Number.isNaN(parseFloat(str))
  ) // ...and ensure strings of whitespace fail
}

const deviceWidth = Dimensions.get('window').width

const isViewStyle = (style: ViewProps['style']): style is ViewStyle => {
  return typeof style === 'object' && style !== null && Object.keys(style).includes('height')
}

export type ScrollHandle = {
  scrollTo: (index: number, animated?: boolean) => void
}

export type ScrollPickerProps = {
  style?: ViewProps['style']
  dataSource: Array<string | number>
  selectedIndex?: number
  onValueChange?: (value: ScrollPickerProps['dataSource'][0], index: number) => void
  renderItem?: (
    data: ScrollPickerProps['dataSource'][0],
    index: number,
    isSelected: boolean,
  ) => JSX.Element
  itemHeight?: number
  wrapperStyle?: ViewStyle
  wrapperHeight?: number
  highlightStyle?: ViewStyle
  // TODO: add proper type to `scrollViewComponent` prop
  // tried using ComponentType<ScrollViewProps & { ref: React.RefObject<ScrollView> }>
  // but ScrollView component from react-native-gesture=handler is not compatible with this.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollViewComponent?: any
}

/** A ScrollPicker component from the `react-native-wheel-scrollview-picker` package
 *
 *
 * Copied from original library because:
 * - its styling was very restrictive and more freedom was needed
 * - it was missing a `scrollTo` method, which was needed
 */
const ScrollPicker = React.forwardRef<ScrollHandle, ScrollPickerProps>(
  ({ itemHeight = 30, style, scrollViewComponent, ...props }: ScrollPickerProps, ref) => {
    const [initialized, setInitialized] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(
      props.selectedIndex && props.selectedIndex >= 0 ? props.selectedIndex : 0,
    )
    const sView = useRef<ScrollView>(null)
    const [isScrollTo, setIsScrollTo] = useState(false)
    const [dragStarted, setDragStarted] = useState(false)
    const [momentumStarted, setMomentumStarted] = useState(false)
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

    const scrollTo = useCallback(
      (index: number, animated = true) => {
        const y = itemHeight * index
        sView?.current?.scrollTo({ y, animated })
      },
      [itemHeight],
    )

    useImperativeHandle(ref, () => ({
      scrollTo,
    }))

    const wrapperHeight =
      props.wrapperHeight ||
      (isViewStyle(style) && isNumeric(style.height) ? Number(style.height) : 0) ||
      itemHeight * 5

    useEffect(() => {
      if (!initialized) {
        setInitialized(true)
        setTimeout(() => scrollTo(selectedIndex), 0)
      }

      return () => {
        if (timer) {
          clearTimeout(timer)
        }
      }
    }, [initialized, itemHeight, selectedIndex, sView, timer, scrollTo])

    const renderPlaceHolder = () => {
      const h = (wrapperHeight - itemHeight) / 2
      const header = <View style={{ height: h, flex: 1 }} />
      const footer = <View style={{ height: h, flex: 1 }} />

      return { header, footer }
    }

    const renderItem = (data: ScrollPickerProps['dataSource'][0], index: number) => {
      const isSelected = index === selectedIndex
      const item = props.renderItem ? (
        props.renderItem(data, index, isSelected)
      ) : (
        <Typography variant={isSelected ? 'default-bold' : 'default'}>{data}</Typography>
      )

      return (
        <View className="items-center justify-center" style={{ height: itemHeight }} key={index}>
          {item}
        </View>
      )
    }
    const scrollFix = useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        let y = 0
        const h = itemHeight
        if (e.nativeEvent.contentOffset) {
          y = e.nativeEvent.contentOffset.y
        }
        const _selectedIndex = Math.round(y / h)

        const _y = _selectedIndex * h
        if (_y !== y) {
          // using scrollTo in ios, onMomentumScrollEnd will be invoked
          if (Platform.OS === 'ios') {
            setIsScrollTo(true)
          }
          sView?.current?.scrollTo({ y: _y })
        }
        if (selectedIndex === _selectedIndex) {
          return
        }
        // onValueChange
        if (props.onValueChange) {
          const selectedValue = props.dataSource[_selectedIndex]
          setSelectedIndex(_selectedIndex)
          props.onValueChange(selectedValue, _selectedIndex)
        }
      },
      [itemHeight, props, selectedIndex],
    )

    const onScrollBeginDrag = () => {
      setDragStarted(true)

      if (Platform.OS === 'ios') {
        setIsScrollTo(false)
      }

      if (timer) {
        clearTimeout(timer)
      }
    }

    const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setDragStarted(false)

      // if not used, event will be garbaged
      const _e: NativeSyntheticEvent<NativeScrollEvent> = { ...e }

      if (timer) {
        clearTimeout(timer)
      }

      setTimer(
        setTimeout(() => {
          if (!momentumStarted) {
            scrollFix(_e)
          }
        }, 50),
      )
    }
    const onMomentumScrollBegin = () => {
      setMomentumStarted(true)
      if (timer) {
        clearTimeout(timer)
      }
    }

    const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setMomentumStarted(false)

      if (!isScrollTo && !dragStarted) {
        scrollFix(e)
      }
    }

    const { header, footer } = renderPlaceHolder()
    const highlightWidth = (isViewStyle(style) ? style.width : 0) || deviceWidth

    const highlightStyle: ViewStyle = {
      position: 'absolute',
      top: (wrapperHeight - itemHeight) / 2,
      height: itemHeight,
      width: highlightWidth,
      ...props.highlightStyle,
    }

    const CustomScrollViewComponent = scrollViewComponent || ScrollView

    return (
      <View style={[props.wrapperStyle, { overflow: 'hidden' }]}>
        <View style={highlightStyle} />
        <CustomScrollViewComponent
          ref={sView}
          bounces={false}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          onMomentumScrollBegin={() => onMomentumScrollBegin()}
          onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
            onMomentumScrollEnd(e)
          }
          onScrollBeginDrag={() => onScrollBeginDrag()}
          onScrollEndDrag={(e: NativeSyntheticEvent<NativeScrollEvent>) => onScrollEndDrag(e)}
        >
          {header}
          {props.dataSource.map(renderItem)}
          {footer}
        </CustomScrollViewComponent>
      </View>
    )
  },
)

export default ScrollPicker
