import { createFileRoute, Link } from '@tanstack/react-router'
import { LegalPage } from '@/components/legal/LegalPage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const Route = createFileRoute('/_layout/privacidad')({
  component: Privacidad,
})

function Privacidad() {
  useDocumentTitle('Política de privacidad')

  return (
    <LegalPage title='Política de privacidad' updatedAt='8 de octubre de 2026'>
      <section>
        <p>
          En Factupanda tratamos tus datos con un principio simple: son tuyos. No los vendemos,
          no los cedemos a anunciantes y no los usamos para perfilarte ni para publicidad.
        </p>
      </section>

      <section>
        <h2>Qué datos recogemos</h2>
        <p>Depende de cómo uses la aplicación.</p>
        <ul>
          <li>
            <strong>Si cotizas sin cuenta:</strong> no guardamos la cotización. Los datos que
            escribes viajan a nuestro servidor para generar el PDF y no se almacenan.
          </li>
          <li>
            <strong>Si creas una cuenta:</strong> tu correo electrónico y una versión cifrada de
            tu contraseña, que nadie puede leer, ni nosotros.
          </li>
          <li>
            <strong>Datos de tu empresa:</strong> nombre, dirección, ciudad, teléfono, número
            fiscal, correo y logo, para que aparezcan en tus documentos.
          </li>
          <li>
            <strong>Tus cotizaciones y productos:</strong> incluidos los datos de contacto de los
            clientes a los que cotizas, porque forman parte del documento.
          </li>
          <li>
            <strong>Datos técnicos:</strong> dirección IP, navegador y páginas con error, para
            detectar fallos.
          </li>
        </ul>
      </section>

      <section>
        <h2>Para qué los usamos</h2>
        <p>
          Para generar tus cotizaciones, guardarlas si tienes cuenta, y encontrar y corregir
          errores de la aplicación. Nada más. No hacemos marketing con ellos.
        </p>
      </section>

      <section>
        <h2>Quién más los procesa</h2>
        <p>
          No compartimos tus datos con terceros con fines comerciales. Sí usamos proveedores de
          infraestructura que los procesan por nuestra cuenta y solo para que el servicio
          funcione:
        </p>
        <ul>
          <li>
            <strong>Amazon Web Services:</strong> almacena los logos que subes.
          </li>
          <li>
            <strong>Sentry:</strong> recibe los informes de error. Un informe puede incluir tu
            correo, tu dirección IP y los datos implicados en la operación que falló.
          </li>
          <li>
            <strong>Nuestro proveedor de correo:</strong> entrega los mensajes de configuración
            de contraseña.
          </li>
        </ul>
      </section>

      <section>
        <h2>Cuánto los conservamos</h2>
        <p>
          Tus cotizaciones y productos se conservan mientras tengas la cuenta activa. Los
          archivos que subes de forma temporal, como un logo antes de guardarlo, se eliminan
          automáticamente a las 24 horas.
        </p>
      </section>

      <section>
        <h2>Tus derechos</h2>
        <p>
          Puedes pedirnos una copia de tus datos, su corrección o su eliminación completa,
          incluida la cuenta. Escríbenos desde el formulario de soporte dentro de la aplicación y
          lo resolvemos.
        </p>
      </section>

      <section>
        <h2>Datos de tus clientes</h2>
        <p>
          Cuando cotizas a un cliente, sus datos los introduces tú. Frente a esa persona el
          responsable eres tú; nosotros solo los almacenamos para que puedas emitir y reutilizar
          el documento.
        </p>
      </section>

      <section>
        <h2>Cambios</h2>
        <p>
          Si cambiamos esta política, actualizaremos la fecha de arriba y lo anunciaremos en la
          sección de Anuncios de la aplicación.
        </p>
        <p>
          Consulta también los <Link to='/terminos' className='link-text'>términos y condiciones</Link>.
        </p>
      </section>
    </LegalPage>
  )
}
