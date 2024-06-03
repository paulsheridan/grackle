import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/booking/$username/schedule')({
  component: () => <div>Hello /booking/$username/appointments!</div>
})