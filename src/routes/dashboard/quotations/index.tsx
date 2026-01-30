import { DashboardLayout, type BreadcrumbItemType } from '@/components/layouts/DashboardLayout';
import { QuotationsTable } from '@/components/quotation/QuotationsTable'
import { Button } from '@/components/ui/button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react';

type QuotationsIndexSearch = {
  per_page: number;
  page: number;
}

export const Route = createFileRoute('/dashboard/quotations/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): QuotationsIndexSearch => {
    return {
      page: Number(search?.page ?? 1),
      per_page: Number(search?.per_page ?? 15)
    }
  }
})

const breadcrumb: BreadcrumbItemType[] = [
  {
    label: "Cotizaciones",
    to: '.'
  }
];

function RouteComponent() {
  useDocumentTitle('Cotizaciones');
  const { page, per_page } = Route.useSearch();

  return (
    <DashboardLayout title='Cotizaciones' description='Lista de cotizaciones guardadas' breadcrumb={breadcrumb}>
      <div>
        <div>
          <Link to='/dashboard/quotation/create'>
            <Button> <PlusIcon /> Nueva Cotización</Button>
          </Link>
        </div>
        <QuotationsTable page={page} perPage={per_page} />
      </div>
    </DashboardLayout>
  )
}
