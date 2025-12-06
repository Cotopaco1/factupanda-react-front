import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar'
import { AppSidebar } from '../../components/app-sidebar'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='p-4 w-full'>
        <SidebarTrigger />
        <Outlet/>
      </main>
    </SidebarProvider>
)
}
