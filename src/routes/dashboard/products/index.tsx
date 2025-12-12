import { ProductsTable } from '@/components/products/ProductsTable'
import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react';

type ProductsIndexSearch = {
  per_page : number;
  page : number;
}

export const Route = createFileRoute('/dashboard/products/')({
  component: RouteComponent,
  validateSearch : (search : Record<string, unknown>) : ProductsIndexSearch => {
    return {
      page : Number(search?.page ?? 1),
      per_page : Number(search?.per_page ?? 15)
    }
  }
})

function RouteComponent() {

     const { page,  per_page } = Route.useSearch();

  return (
    <div className='grid gap-10 p-4'>
      <div className='my-6'>
        <h1 className='text-xl md:text-2xl mb-2'>Productos</h1>
        <p className='text-muted-foreground text-sm md:text-base'>Visualiza los productos que tienes creados</p>
      </div>
      <div>
        <div>
          <Link to='/dashboard/products/create'>
            <Button> <PlusIcon/> Agregar Producto</Button>
          </Link>
        </div>
        {/* Tabla de productos... */}
        <ProductsTable page={page} perPage={per_page} />
        
      </div>
    </div>
  )
}
