import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QuotationsGeneratedCounter } from '@/components/landing/QuotationsGeneratedCounter'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CoinsIcon, DownloadIcon, PaletteIcon, PackageIcon, PencilIcon, PercentIcon, type LucideIcon } from 'lucide-react'
import ExampleQuotation from '@/assets/example-quotation-factupanda.jpg'
import ClasicoImg from '@/assets/showcase/factupanda-clasico.png'
import EjecutivoImg from '@/assets/showcase/factupanda-ejecutivo.png'
import ModernoImg from '@/assets/showcase/factupanda-moderno.png'

export const Route = createFileRoute('/_layout/')({
  component: Index,
})

/**
 * Estilo sticker tomado de brands/factupanda/brand.json: borde grueso y sombra
 * solida sin difuminar. Usa el token sticker-ink, definido en ambos temas.
 */
const STICKER = 'border-sticker-ink rounded-2xl border-[3px] shadow-[6px_6px_0_var(--sticker-ink)]'

type FeatureItemType = {
  icon: LucideIcon
  title: string
  detail: string
}

const features: FeatureItemType[] = [
  {
    title: 'Descargable en PDF',
    detail: 'Lista para enviar a tu cliente en un clic.',
    icon: DownloadIcon,
  },
  {
    title: 'Tu logo y tus colores',
    detail: 'El documento sale con tu marca, no con la nuestra.',
    icon: PaletteIcon,
  },
  {
    title: 'Impuestos y descuentos',
    detail: 'Se calculan solos, por producto o al total.',
    icon: PercentIcon,
  },
  {
    title: 'Productos guardados',
    detail: 'No vuelves a escribir lo que ya cotizaste.',
    icon: PackageIcon,
  },
  {
    title: '20 monedas',
    detail: 'Cotiza en pesos, soles, dólares o euros, con su formato correcto.',
    icon: CoinsIcon,
  },
  {
    title: 'Editar y regenerar',
    detail: 'Cambia una cotización guardada y descarga el PDF otra vez.',
    icon: PencilIcon,
  },
]

const TEMPLATES = [
  { img: ClasicoImg, label: 'Clásico' },
  { img: EjecutivoImg, label: 'Ejecutivo' },
  { img: ModernoImg, label: 'Moderno' },
]

/**
 * Sin tarjeta: icono y texto separados solo por espacio. La pagina ya acumula
 * bordes gruesos en el hero, la imagen y el bocadillo.
 */
function FeatureItem({ icon, title, detail }: FeatureItemType) {
  const IconC = icon

  return (
    <li className='flex items-start gap-3'>
      <IconC className='text-highlight mt-0.5 size-6 shrink-0' />
      <div className='flex flex-col gap-0.5'>
        {/* Sin font-display: solo hay cargado el peso 700 de Fredoka, y a 16px
            una redondeada en 700 pesa demasiado. Es fuente de titulares. */}
        <p className='font-semibold leading-tight'>{title}</p>
        <p className='text-muted-foreground text-sm'>{detail}</p>
      </div>
    </li>
  )
}

function Index() {
  return (
    <div className='flex flex-col gap-16 py-4'>
      {/* El ejemplo de cotizacion es el mejor activo visual que hay y estaba
          enterrado en la tercera seccion, asi que sube al hero. */}
      <section className='grid items-center gap-10 lg:grid-cols-2'>
        <div className='flex flex-col gap-6'>
          <div>
            <span className='bg-sticker-pop border-sticker-ink font-display rounded-full border-[3px] px-3 py-1 text-sm text-neutral-950 shadow-[3px_3px_0_var(--sticker-ink)]'>
              Gratis, sin crear cuenta
            </span>
          </div>
          <h1 className='font-display text-5xl leading-[0.95] tracking-tight lg:text-6xl'>
            Cotiza en minutos, <span className='text-highlight'>no en tardes</span>
          </h1>
          <p className='text-muted-foreground text-lg'>
            Pon tu logo, tus colores y tus impuestos. Descárgala en PDF y envíala.
          </p>
          <div>
            <Button className={`font-display h-auto p-6 text-base ${STICKER}`} asChild>
              <Link to='/dashboard/quotation/create'>Crear mi primera cotización</Link>
            </Button>
          </div>
        </div>
        <figure className='flex flex-col gap-3'>
          <img
            className={`w-full ${STICKER}`}
            src={ExampleQuotation}
            alt='Ejemplo de una cotización generada en Factupanda, con logo y totales'
          />
          <figcaption className='text-muted-foreground text-center text-sm'>
            Así se ve una cotización recién generada.
          </figcaption>
        </figure>
      </section>

      <QuotationsGeneratedCounter />

      <section>
        <h2 className='font-display mb-6 text-3xl'>Lo que incluye</h2>
        <ul className='grid gap-x-10 gap-y-6 sm:grid-cols-2'>
          {features.map((feat) => (
            <FeatureItem {...feat} key={feat.title} />
          ))}
        </ul>
      </section>

      {/* Las tres plantillas reales del generador: classic, executive y modern.
          En pestañas y no en fila: a 1152px de ancho, tres en columna dejaban
          cada imagen a 360px, un 27% de su tamaño real (1300x870). */}
      <section>
        <h2 className='font-display mb-6 text-3xl'>Tres diseños para elegir</h2>
        <Tabs defaultValue={TEMPLATES[0].label} className='gap-5'>
          <TabsList className='mx-auto'>
            {TEMPLATES.map((template) => (
              <TabsTrigger key={template.label} value={template.label} className='font-display px-5'>
                {template.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TEMPLATES.map((template) => (
            /* forceMount: sin esto Radix desmonta las inactivas y cambiar de
               pestaña volveria a cargar la imagen cada vez. */
            <TabsContent
              key={template.label}
              value={template.label}
              forceMount
              className='data-[state=inactive]:hidden'
            >
              <img
                src={template.img}
                alt={`Plantilla ${template.label} de cotización en Factupanda`}
                width={1307}
                height={868}
                loading='lazy'
                decoding='async'
                className={`mx-auto w-full max-w-3xl ${STICKER}`}
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  )
}
