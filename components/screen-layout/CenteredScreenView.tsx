import ScreenView, { ScreenViewProps } from '@/components/screen-layout/ScreenView'

const CenteredScreenView = ({
  children,
  backgroundVariant = 'dots',
  contentPosition = 'center',
  ...rest
}: ScreenViewProps) => {
  return (
    <ScreenView backgroundVariant={backgroundVariant} contentPosition={contentPosition} {...rest}>
      {children}
    </ScreenView>
  )
}

export default CenteredScreenView
