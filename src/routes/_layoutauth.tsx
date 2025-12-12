import { Card } from '@/components/ui/card'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layoutauth')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
    <div className='h-screen flex items-center justify-center'>
      <Card>
        <Outlet />

      </Card>
    </div>
  )
}
