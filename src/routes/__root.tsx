import { MaintenanceScreen } from '@/components/MaintenanceScreen'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const maintenanceEnabled =
  import.meta.env.VITE_MAINTENANCE_MODE?.toLowerCase() === 'true'

const maintenanceMessage =
  import.meta.env.VITE_MAINTENANCE_MESSAGE ??
  'Nos demoramos aproximadamente 1 hora. Gracias por tu paciencia.'

const RootLayout = () => (
  <ThemeProvider defaultTheme='light'>
    {maintenanceEnabled ? (
      <MaintenanceScreen message={maintenanceMessage} />
    ) : (
      <Outlet />
    )}
    <Toaster richColors position='top-center' />
    {/* <TanStackRouterDevtools /> */}
  </ThemeProvider>
)

export const Route = createRootRoute({ component: RootLayout })
