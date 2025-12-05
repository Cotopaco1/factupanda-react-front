import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/quotation/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/quotation/create"!</div>
}
