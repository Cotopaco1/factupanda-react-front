import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout = () => (
  <ThemeProvider defaultTheme='light'>
    <Outlet />
    <Toaster richColors position='top-center'/>
    {/* <TanStackRouterDevtools /> */}
  </ThemeProvider>
)

export const Route = createRootRoute({ component: RootLayout })