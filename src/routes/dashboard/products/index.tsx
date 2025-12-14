import { DashboardLayout, type BreadcrumbItemType } from '@/components/layouts/DashboardLayout';
import { ProductsTable } from '@/components/products/ProductsTable'
import { Button } from '@/components/ui/button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
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

const breadcrumb : BreadcrumbItemType[] = [
  {
    label : "Productos",
    to : '.'
  }
];

function RouteComponent() {
  useDocumentTitle('Productos');
  const { page,  per_page } = Route.useSearch();

  return (
    <DashboardLayout title='Productos' description='Lista de productos' breadcrumb={breadcrumb}>
        <div>
          <div>
            <Link to='/dashboard/products/create'>
              <Button> <PlusIcon/> Agregar Producto</Button>
            </Link>
          </div>
          {/* Tabla de productos... */}
          <ProductsTable page={page} perPage={per_page} />
          
        </div>
    </DashboardLayout>
  )
}
