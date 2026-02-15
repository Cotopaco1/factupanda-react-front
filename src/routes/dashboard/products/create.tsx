import { ButtonLoader } from '@/components/ButtonLoader'
import { DashboardLayout, type BreadcrumbItemType } from '@/components/layouts/DashboardLayout'
import { PersistentProductFormFields } from '@/components/products/PersistentProductFormFields'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { type ProductCreateFormInput, productCreateSchema } from '@/schemas/products'
import { MergeServerErrorsToForm } from '@/services/errorService'
import { useProductService } from '@/services/productService'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/products/create')({
  component: RouteComponent,
})

const breadcrumb : BreadcrumbItemType[] = [
    {
        label : 'Productos',
        to : '/dashboard/products'
    },
    {
        label : 'Crear',
        to : '/dashboard/products/create'
    }
]

function RouteComponent() {
    useDocumentTitle('Crear Producto');
    const {create, loading} = useProductService();
    const form = useForm<ProductCreateFormInput>({
        defaultValues : {
            description : '',
            discount_percentage : 0,
            name : '',
            tax_percentage : 0,
            unit_of_measurement : '',
            unit_price : 1
        },
        resolver : zodResolver(productCreateSchema),
    });
    const onSubmit = (data: ProductCreateFormInput) => {
        create(data).then(() => {
            form.reset();
            toast.success("Producto creado");
        }).catch( async (error) => {
            await MergeServerErrorsToForm(error, form);
        })
    }
  return (
    <DashboardLayout title='Crear Producto' description='Crea un nuevo producto para buscarlo facilmente al generar la cotización.' breadcrumb={breadcrumb}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4' >
            <div className='grid md:grid-cols-2 gap-4'>
                <PersistentProductFormFields control={form.control}/>

            </div>
                <div>
                    <ButtonLoader loading={loading} >Crear</ButtonLoader>
                </div>    
        </form>
    </DashboardLayout>
  )
}
