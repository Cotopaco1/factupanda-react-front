import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div>Hello This is dashboard layout</div>
      <Outlet/>
    </div>
)
}
