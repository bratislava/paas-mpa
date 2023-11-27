import clsx from 'clsx'

import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'

export const ErrorMessage = ({ message, className }: { className?: string; message: string }) => (
  <Panel className={clsx('bg-negative-light px-5 py-4', className)}>
    <Typography>{message}</Typography>
  </Panel>
)
