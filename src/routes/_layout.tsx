import { HeaderGuest } from '@/components/guest/HeaderGuest'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderGuest/>

      <main className="flex-1 container w-full py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      
      {/* Footer general */}
      <footer className="bg-secondary text-secondary-foreground border-t mt-auto">
        <div className="container py-4 px-4 sm:px-6 lg:px-8">
          <p className='text-center'>Desarrollado por <a href="https://www.linkedin.com/in/sergio-silva-sanchez-2556a9244/" className="link-text">Sergio Silva</a> </p>
          <p className="text-center text-sm text-gray-500">
            © 2025 FactuPanda. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
