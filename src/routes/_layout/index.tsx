import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { FileIcon, GiftIcon, PackageIcon, PercentIcon, UserIcon, type LucideIcon } from 'lucide-react'
import ExampleQuotation from "@/assets/example-quotation-factupanda.jpg";

export const Route = createFileRoute('/_layout/')({
  component: Index,
})

type FeatureItemType = {
  icon : LucideIcon;
  title : string;
}
const features : FeatureItemType[] = [
  {
    title : 'Descargable en formato PDF',
    icon : FileIcon
  },
  {
    title : 'Colores y Logo personalizables',
    icon : UserIcon
  },
  {
    title : 'Impuestos y descuentos disponibles',
    icon : PercentIcon
  },
  {
    title : 'Gratuita y en constante actualización',
    icon : GiftIcon
  },
  {
    title : 'Persistencia de Productos',
    icon : PackageIcon
  }
];

function FeatureItem ({icon, title}:FeatureItemType){
  const IconC = icon;
  return (
    <li className='p-4 shadow w-full md:p-8 '>
      <div className='mb-4'>
        <IconC className='text-highlight'/>
      </div>
      <p>{title}</p>
    </li>
  )
}

function SectionTitle ({title}: {title : string}){
  return (
    <h2 className='font-bold tracking-wide text-2xl mb-6'>{title}</h2>
  )
}

function Index() {
  return (
    <div className='grid gap-6' >
      {/* First Section */}
        <div className='max-w-xl flex flex-col gap-10'>
          <h1 className='text-4xl font-bold'>
            Crea Cotizaciones <span className='text-highlight'>gratuitas, profesionales y personalizables.</span>
          </h1>
          <h2>
            Personalizado con el logo de tu empresa, descuentos e impuestos disponibles. Descargala en formato PDF. y todo totalmente <span className='text-highlight font-bold'>GRATUITO!</span>
          </h2>
          <Button className='w-max p-6'>
            <Link to='/dashboard/quotation/create'>Crear Cotización</Link>
          </Button>
        </div>
        {/* Second */}
        <div>
          <SectionTitle title='Caracteristicas'/>
          <ul className='flex flex-col gap-8 lg:flex-row lg:justify-between '>
            {features.map(feat => (
              <FeatureItem icon={feat.icon} title={feat.title} key={feat.title}/>
            ))}
          </ul>
        </div>
        {/* Third */}
        <div>
            <SectionTitle title="Ejemplos - Protitpos"/>
            <div className='mx-auto flex flex-col items-center justify-center'>
              <div>
                <img className='border-3 border-solid border-primary' src={ExampleQuotation} alt="ejemplo de cotizacion" />
              </div>
              <p className='text-muted-foreground'>Cotización generada en factupanda</p>
            </div>
        </div>
    </div>
  )
}