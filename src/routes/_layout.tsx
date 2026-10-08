import { HeaderGuest } from '@/components/guest/HeaderGuest'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderGuest/>

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex-1 py-6">
        <Outlet />
      </main>
      
      {/* Footer general */}
      <footer className="bg-secondary text-secondary-foreground border-t mt-auto">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
          <p className='text-center'>Desarrollado por <a href="https://www.linkedin.com/in/sergio-silva-sanchez-2556a9244/" className="link-text">Sergio Silva</a> </p>
          <nav className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
            <Link to="/terminos" className="link-text">Términos y condiciones</Link>
            <Link to="/privacidad" className="link-text">Política de privacidad</Link>
          </nav>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            © {new Date().getFullYear()} FactuPanda. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
