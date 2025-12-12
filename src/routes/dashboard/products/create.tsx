import { ButtonLoader } from '@/components/ButtonLoader'
import { ProductFormFields } from '@/components/products/ProductFormFields'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import  { type ProductForm, productSchema } from '@/schemas/quotation'
import { MergeServerErrorsToForm } from '@/services/errorService'
import { useProductService } from '@/services/productService'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/products/create')({
  component: RouteComponent,
})

function RouteComponent() {
    const {create} = useProductService();
    const form = useForm<ProductForm>({
        defaultValues : {
            description : '',
            discount_percentage : 0,
            name : '',
            quantity : 1,
            tax_percentage : 0,
            unit_of_measurement : '',
            unit_price : 1
        },
        resolver : zodResolver(productSchema),
    });
    const onSubmit = (data) => {
        create(data).then(response => {
            console.log(response.data.product);
            toast.success("Producto creado");
        }).catch(error => {
            MergeServerErrorsToForm(error, form);
        })
    }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
            <CardHeader>
                <CardTitle>Crear Producto</CardTitle>
                <CardDescription>Crea un nuevo producto para buscarlo facilmente al generar la cotización</CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4 md:grid-cols-2'>
                <ProductFormFields control={form.control}/>
            </CardContent>
            <CardFooter>
                <ButtonLoader loading={false} >Crear</ButtonLoader>
            </CardFooter>
        </Card>        
    </form>
  )
}
