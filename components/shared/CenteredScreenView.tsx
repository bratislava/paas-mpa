import ScreenView, { ScreenViewProps } from '@/components/shared/ScreenView'

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
