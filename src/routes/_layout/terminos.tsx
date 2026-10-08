import { createFileRoute, Link } from '@tanstack/react-router'
import { LegalPage } from '@/components/legal/LegalPage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const Route = createFileRoute('/_layout/terminos')({
  component: Terminos,
})

function Terminos() {
  useDocumentTitle('Términos y condiciones')

  return (
    <LegalPage title='Términos y condiciones' updatedAt='8 de octubre de 2026'>
      <section>
        <p>
          Al usar Factupanda aceptas estas condiciones. Están escritas en lenguaje claro a
          propósito: si algo no se entiende, escríbenos desde el formulario de soporte.
        </p>
      </section>

      <section>
        <h2>Qué es el servicio</h2>
        <p>
          Factupanda genera cotizaciones en PDF con los datos que introduces. Puedes usarlo sin
          crear cuenta; si la creas, además guardamos tus cotizaciones y tu catálogo de productos
          para que los reutilices.
        </p>
      </section>

      <section>
        <h2>Es gratuito</h2>
        <p>
          El servicio es gratuito y sin límite de cotizaciones. No hay cobros ocultos ni versión
          de prueba que caduque. Si algún día ofreciéramos funciones de pago, lo anunciaríamos
          antes y lo que hoy es gratis seguiría siéndolo.
        </p>
      </section>

      <section>
        <h2>Tu responsabilidad</h2>
        <ul>
          <li>Los datos que introduces son tuyos y respondes de su exactitud.</li>
          <li>
            Una cotización generada aquí es un documento comercial que emites tú. No es una
            factura fiscal ni sustituye tus obligaciones tributarias.
          </li>
          <li>
            Si cotizas a un cliente, necesitas estar habilitado para tratar sus datos de
            contacto.
          </li>
          <li>No puedes usar el servicio para actividades ilícitas ni para enviar spam.</li>
          <li>Mantén tu contraseña a salvo. Las acciones de tu cuenta se te atribuyen.</li>
        </ul>
      </section>

      <section>
        <h2>Nuestra responsabilidad</h2>
        <p>
          Ponemos cuidado en que el servicio funcione, pero se ofrece tal cual, sin garantía de
          disponibilidad ininterrumpida. No respondemos por pérdidas derivadas de errores en los
          datos que introduces, de decisiones comerciales tomadas a partir de un documento
          generado aquí, ni de interrupciones del servicio.
        </p>
        <p>
          Hacemos copias de seguridad diarias, pero te recomendamos conservar tus propios PDF de
          las cotizaciones que importen.
        </p>
      </section>

      <section>
        <h2>Tu contenido</h2>
        <p>
          Lo que subes sigue siendo tuyo: tu logo, tus textos y tus datos. No lo usamos para otra
          cosa que prestarte el servicio. Puedes pedir su eliminación cuando quieras.
        </p>
      </section>

      <section>
        <h2>Suspensión</h2>
        <p>
          Podemos suspender una cuenta que incumpla estas condiciones o que ponga en riesgo el
          servicio para los demás. Si ocurre, te lo explicaremos.
        </p>
      </section>

      <section>
        <h2>Cambios</h2>
        <p>
          Si modificamos estas condiciones, actualizaremos la fecha de arriba y lo anunciaremos
          en la sección de Anuncios de la aplicación.
        </p>
        <p>
          Consulta también la{' '}
          <Link to='/privacidad' className='link-text'>política de privacidad</Link>.
        </p>
      </section>
    </LegalPage>
  )
}
