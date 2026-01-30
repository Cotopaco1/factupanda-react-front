import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm, useFieldArray } from "react-hook-form"
import { useEffect, useState } from 'react'
import { useQuotationService } from '@/services/quotationService'
import { FieldSet, FieldLegend, FieldGroup, FieldContent, FieldError } from "@/components/ui/field"
import { FormInput } from '@/components/form/FormInput'
import { FormSelect } from '@/components/form/FormSelect'
import { CompanyOrCustomerFormField } from '@/components/quotation/CompanyOrCustomerFormFields'
import { zodResolver } from "@hookform/resolvers/zod"
import { quotationEditSchema, type QuotationEditForm } from '@/schemas/quotation'
import { ProductsTable } from '@/components/quotation/ProductsTable'
import { PlusIcon } from 'lucide-react'
import { DialogProductForm } from '@/components/products/DialogProductForm'
import { FormTextarea } from '@/components/form/FormTextarea'
import { ButtonLoader } from '@/components/ButtonLoader'
import { MergeServerErrorsToForm } from '@/services/errorService'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { toast } from 'sonner'
import { DashboardLayout, type BreadcrumbItemType } from '@/components/layouts/DashboardLayout'

export const Route = createFileRoute('/dashboard/quotations/$id/edit')({
  component: RouteComponent,
})

// TODO: Activar cuando estén listos
const SHOW_CURRENCY_SELECT = false
const SHOW_LOCALE_SELECT = false

const localeOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
]

const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'MXN', label: 'MXN' },
  { value: 'COP', label: 'COP' },
  { value: 'ARS', label: 'ARS' },
  { value: 'CLP', label: 'CLP' },
  { value: 'PEN', label: 'PEN' },
]

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  useDocumentTitle('Editar Cotización')

  const breadcrumb: BreadcrumbItemType[] = [
    { label: 'Cotizaciones', to: '/dashboard/quotations' },
    { label: 'Editar', to: '.' }
  ]

  const form = useForm<QuotationEditForm>({
    defaultValues: {
      number: '',
      date: '',
      due_date: '',
      currency: 'USD',
      locale: 'es',
      notes: '',
      terms: '',
      discount: 0,
      is_flat_discount: false,
      tax: 0,
      client: {
        name: '',
        fiscal_number: '',
        address: '',
        email: '',
        phone: '',
        city: '',
      },
      company: {
        name: '',
        fiscal_number: '',
        address: '',
        email: '',
        phone: '',
        city: '',
      },
      products: [],
    },
    resolver: zodResolver(quotationEditSchema)
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products'
  })

  const { getById, update, loading } = useQuotationService()
  const [initialLoading, setInitialLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    getById(Number(id))
      .then(response => {
        const q = response.data.data
        // Formatear fechas de ISO a YYYY-MM-DD
        const formatDate = (isoDate: string) => {
          if (!isoDate) return ''
          return isoDate.split('T')[0]
        }

        form.reset({
          number: q.number || '',
          date: formatDate(q.date),
          due_date: formatDate(q.due_date),
          currency: q.currency || 'USD',
          locale: (q.locale as 'en' | 'es') || 'es',
          notes: q.notes || '',
          terms: q.terms || '',
          discount: parseFloat(q.discount_value) || 0,
          is_flat_discount: q.is_flat_discount || false,
          tax: parseFloat(q.tax_percentage) || 0,
          client: {
            name: q.client_name || '',
            fiscal_number: q.client_fiscal_number || '',
            address: q.client_address || '',
            email: q.client_email || '',
            phone: q.client_phone || '',
            city: q.client_city || '',
          },
          company: {
            name: q.company_name || '',
            fiscal_number: q.company_fiscal_number || '',
            address: q.company_address || '',
            email: q.company_email || '',
            phone: q.company_phone || '',
            city: q.company_city || '',
          },
          products: q.lines?.map((p: any) => ({
            name: p.name,
            description: p.description || '',
            unit_of_measurement: p.unit_of_measurement || 'unidad',
            unit_price: parseFloat(p.unit_price),
            quantity: p.quantity,
            discount_percentage: parseFloat(p.discount_percentage) || 0,
            tax_percentage: parseFloat(p.tax_percentage) || 0,
          })) || [],
        })
      })
      .catch(() => {
        toast.error("Error al cargar la cotización")
        navigate({ to: '/dashboard/quotations' })
      })
      .finally(() => {
        setInitialLoading(false)
      })
  }, [id])

  const onSubmit = (data: QuotationEditForm) => {
    update(Number(id), data)
      .then(() => {
        toast.success("Cotización actualizada")
        navigate({ to: '/dashboard/quotations' })
      })
      .catch(async (error) => {
        await MergeServerErrorsToForm(error, form)
      })
  }

  const handleDeleteProduct = (index: number) => {
    remove(index)
  }

  if (initialLoading) {
    return (
      <DashboardLayout title='Editar Cotización' description='Cargando...' breadcrumb={breadcrumb}>
        <div className="flex items-center justify-center py-10">
          <p className="text-muted-foreground">Cargando cotización...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title='Editar Cotización' description='Modifica los datos de tu cotización' breadcrumb={breadcrumb}>
      <DialogProductForm cbAdd={append} open={dialogOpen} setOpen={setDialogOpen} />

      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Editar Cotización</CardTitle>
          <CardDescription>Actualiza los datos de la cotización. Todos los cambios se guardarán automáticamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <FieldSet>
              <FieldLegend>Detalles Cotización</FieldLegend>
              <FieldGroup className='grid md:grid-cols-2 lg:grid-cols-3'>
                <FormInput
                  name="number"
                  control={form.control}
                  type='text'
                  label='Número de Cotización'
                  placeholder='Q-001'
                  required
                />
                <FormInput
                  name="date"
                  control={form.control}
                  type='date'
                  label='Fecha'
                  required
                />
                <FormInput
                  name="due_date"
                  control={form.control}
                  type='date'
                  label='Fecha de Vencimiento'
                  required
                />
                {SHOW_CURRENCY_SELECT && (
                  <FormSelect
                    name="currency"
                    control={form.control}
                    options={currencyOptions}
                    optionLabel='label'
                    optionValue='value'
                    label='Moneda'
                  />
                )}
                {SHOW_LOCALE_SELECT && (
                  <FormSelect
                    name="locale"
                    control={form.control}
                    options={localeOptions}
                    optionLabel='label'
                    optionValue='value'
                    label='Idioma'
                  />
                )}
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Información de la Empresa</FieldLegend>
              <FieldGroup>
                <CompanyOrCustomerFormField control={form.control} suffix='company' />
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Información del Cliente</FieldLegend>
              <FieldGroup>
                <CompanyOrCustomerFormField control={form.control} suffix='client' />
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Productos</FieldLegend>
              {form.formState.errors.products && (
                <FieldError errors={[form.formState.errors.products]} />
              )}
              <div className='flex flex-col gap-2'>
                <div>
                  <Button size="sm" type='button' onClick={() => setDialogOpen(true)}>
                    <PlusIcon /> Agregar producto
                  </Button>
                </div>
              </div>
              <FieldGroup>
                <FieldContent>
                  <ProductsTable products={fields} onDelete={handleDeleteProduct} />
                </FieldContent>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Información Extra</FieldLegend>
              <FieldGroup>
                <FieldContent className='grid md:grid-cols-2 gap-4'>
                  <FormTextarea control={form.control} name='notes' label='Notas' placeholder='Notas adicionales para el cliente' />
                  <FormTextarea control={form.control} name='terms' label='Términos y Condiciones' placeholder='Términos de pago y condiciones' />
                </FieldContent>
              </FieldGroup>
            </FieldSet>

            <div className='flex gap-4'>
              <ButtonLoader className='py-6' loading={loading} type='submit'>
                Guardar Cambios
              </ButtonLoader>
              <Button type='button' variant='outline' onClick={() => navigate({ to: '/dashboard/quotations' })}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
