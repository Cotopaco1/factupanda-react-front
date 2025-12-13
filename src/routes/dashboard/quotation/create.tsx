import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm, useFieldArray } from "react-hook-form"
import { useEffect, useMemo, useState } from 'react'
import { useQuotationService } from '@/services/quotationService';
import type { DueDates } from '@/types/quotation'
import { FieldSet, FieldLegend, FieldGroup, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { FormInput } from '@/components/form/FormInput'
import { FormSelect } from '@/components/form/FormSelect'
import { CompanyOrCustomerFormField } from '@/components/quotation/CompanyOrCustomerFormFields'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { quotationSchema } from '@/schemas/quotation'
import { ProductsTable } from '@/components/quotation/ProductsTable'
import { PlusIcon } from 'lucide-react'
import { DialogProductForm } from '@/components/products/DialogProductForm'
import { FormUploadInput } from '@/components/form/FormUploadInput'
import { FormColorInput } from '@/components/form/FormColorInput'
import { DialogPdfQuotation } from '@/components/quotation/DialogPdfQuotation'
import { FormTextarea } from '@/components/form/FormTextarea'
import { ProductSearchInput } from '@/components/products/ProductsSearchInput'
import { useUserStore } from '@/stores/userStore'
import { DialogQuantity } from '@/components/quotation/DialogQuantity'
import type { Product } from '@/types/products'
import { ButtonLoader } from '@/components/ButtonLoader'
import { MergeServerErrorsToForm } from '@/services/errorService'

type FormValues = z.infer<typeof quotationSchema>

export const Route = createFileRoute('/dashboard/quotation/create')({
  component: RouteComponent,
})

const retreiveCompanyData = () => {
    const company = localStorage.getItem('quotation.company');
    return company ?
      JSON.parse(company) :
      {name: "", address: "", city: "", fiscal_number: "", email: "", phone: ""}
}

const retreiveCustomizationSettings = () : {primaryColor : string, secundaryColor : string} => {
  const customizationSettings = localStorage.getItem('quotation.customization');
  return customizationSettings ?
    JSON.parse(customizationSettings) :
    { primaryColor : '#3ab8eb', secundaryColor : '#3ab8eb', }
}

const retreiveQuotationDefaultValues = () : FormValues => {
  return {
        number: "",
        date: "",
        due_date_id: 0,
        company: retreiveCompanyData(),
        client: {
          name: "",
          address: "",
          city: "",
          fiscal_number: "",
          email: "",
          phone: "",
        },
        products : [],
        temporary_logo : '',
        code : 'en-US',
        notes : '',
        terms : '',
        ... retreiveCustomizationSettings()
  }
}


function RouteComponent() {

  const defaultValues = useMemo(()=>retreiveQuotationDefaultValues(), []);
  const form = useForm<FormValues>({
      defaultValues: defaultValues,
    resolver : zodResolver(quotationSchema)
  });

  const {fields, append,remove} = useFieldArray({
    control : form.control,
    name : 'products'
  });
  
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfUrl , setPdfUrl] = useState('');
  const [dialogQuantityOpen, setDialogQuantityOpen] = useState(false);
  const [cbDialogQuantity, setCbDialogQuantity] = useState<(number : number)=>any>(()=>null)
  const {createQuotation, getDueDates , loading:quotationLoading} = useQuotationService();
  const [dueDates, setDueDates] = useState<DueDates[]|[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isLogin = useUserStore(state => state.isLogin);
  const onSubmit = (data : FormValues) => {
    console.log(data);
    createQuotation(data)
    .then((file) => {
      setPdfUrl(URL.createObjectURL(file))
      setPdfOpen(true);
      try{
        localStorage.setItem('quotation.company', JSON.stringify(data.company))
        localStorage.setItem('quotation.customization', JSON.stringify({primaryColor : data.primaryColor, secundaryColor : data.secundaryColor}))
      }catch(error){
        console.log("An error ocurred during saving default values",error )
      }
      
    })
    .catch(async (error) => {
      await MergeServerErrorsToForm(error, form);
    });
  }
  const handleDeleteProduct = (index : number) => {
      remove(index);
  }

  const cbProductSearch = (product : Product) => {

    setCbDialogQuantity(()=>{
      return (number : number)=>append({...product, quantity : number});
    })
    setDialogQuantityOpen(true);

  }

  useEffect(() => {
    getDueDates().then((data) => {
      if(data) setDueDates(data);
    });
  }, []);

  /* Limpiar URL hacia el object. watch() */
  useEffect(()=>{
    if(!pdfOpen && pdfUrl) URL.revokeObjectURL(pdfUrl)
  }, [pdfOpen])


  return (
    <div>
      <DialogQuantity open={dialogQuantityOpen} setOpen={setDialogQuantityOpen} cb={cbDialogQuantity} />
      <DialogPdfQuotation open={pdfOpen} setOpen={setPdfOpen} url={pdfUrl}/>
      {/* Dialog Product */}
      <DialogProductForm cbAdd={append} open={dialogOpen} setOpen={setDialogOpen}/>
     {/* Card con la info  */}
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Generar Cotización</CardTitle>
          <CardDescription>Genera una cotización en formato PDF, con los colores y el logo de tu Empresa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            {/* Section 1 */}
            
          
              {/* Section 1 content */}
              <FieldSet>
                <FieldLegend>Detalles Cotización</FieldLegend>
                <FieldGroup className='grid md:grid-cols-2'>
                  <FormInput
                    name="number"
                    control={form.control}
                    type='text'
                    label='Número de Cotización'
                    placeholder='001'
                    className='md:col-span-2'
                  />

                  <FormInput
                    name="date"
                    control={form.control}
                    type='date'
                    label='Fecha'
                    placeholder='001'
                  />

                  <FormSelect 
                    name="due_date_id"  
                    control={form.control}
                    options={dueDates}
                    optionLabel='name'
                    optionValue='unique_id'
                    label='Fecha de vencimiento'
                  />
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Personalización</FieldLegend>
                <FieldGroup className='grid md:grid-cols-2'>
                    {/* FormUploadImage */}
                    <FormUploadInput control={form.control} label='Logo de la empresa' name='temporary_logo'/>
                    {/* FormColorPicker */}
                    <div>
                      <FieldLabel className='mb-3'>Colores</FieldLabel>
                      <div className='flex flex-col md:flex-row gap-4'>
                        <FormColorInput control={form.control} label="Principal" name="primaryColor" />
                        <FormColorInput control={form.control} label="Secundario" name="secundaryColor" />

                      </div>
                    </div>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Información de la empresa</FieldLegend>
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
              {/* Products Table */}
              <FieldSet>
                <FieldLegend>Productos</FieldLegend>
                {form.formState.errors.products && (
                  <FieldError errors={[form.formState.errors.products]}/>
                )}
                <div className='flex flex-col gap-2'>
                  <div>
                    <Button size="sm" type='button' onClick={() => setDialogOpen(true)}>
                      <PlusIcon/> Agregar nuevo producto
                    </Button>
                  </div>
                  {isLogin && (
                    <div>
                      <ProductSearchInput cbSelected={cbProductSearch}/>
                    </div>
                  )}
                </div>
                <FieldGroup>
                  <FieldContent>
                    <ProductsTable products={fields} onDelete={handleDeleteProduct}/>
                  </FieldContent>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Información extra</FieldLegend>
                <FieldGroup>
                  <FieldContent className='grid md:grid-cols-2 gap-4'>
                    <FormTextarea control={form.control} name='notes' label='Notas' placeholder='El envío corre por cuenta del cliente'/>
                    <FormTextarea control={form.control} name='terms' label='Terminos y condiciones' placeholder='Enviar el pago a la cuenta #221332123'/>
                  </FieldContent>
                </FieldGroup>
              </FieldSet>

            <div>
              <ButtonLoader className='py-6' loading={quotationLoading} type='submit'>Generar cotización</ButtonLoader>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
