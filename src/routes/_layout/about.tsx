import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/about')({
  component: About,
})

function About() {
  return (
    <div className="px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Acerca de FactuPanda</h1>
        <div className="prose prose-lg text-gray-600">
          <p>
            FactuPanda es una solución integral para la gestión empresarial que te ayuda 
            a manejar tu facturación, inventario y clientes de manera eficiente.
          </p>
          <p>
            Nuestra misión es simplificar los procesos administrativos para que puedas 
            enfocarte en hacer crecer tu negocio.
          </p>
        </div>
      </div>
    </div>
  )
}