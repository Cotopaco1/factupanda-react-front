import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layoutauth/configurar-password2')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layoutauth/configurar-password"!</div>
}
