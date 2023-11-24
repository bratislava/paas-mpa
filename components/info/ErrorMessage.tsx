import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'

export const ErrorMessage = ({ message }: { message: string }) => (
  <Panel className="bg-negative-light px-5 py-4">
    <Typography>{message}</Typography>
  </Panel>
)
