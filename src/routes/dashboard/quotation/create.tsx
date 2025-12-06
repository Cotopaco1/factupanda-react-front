import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form"
import { useEffect, useState } from 'react'
import { useQuotationService } from '@/services/quotationService';
import type { QuotationForm, DueDates } from '@/types/quotation'
import { FieldSet, FieldLegend, FieldGroup, FieldContent } from "@/components/ui/field"
import { FormInput } from '@/components/form/FormInput'
import { FormSelect } from '@/components/form/FormSelect'
import { CompanyOrCustomerFormField } from '@/components/quotation/CompanyOrCustomerFormFields'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { quotationSchema } from '@/schemas/quotation'
import { ProductsTable } from '@/components/quotation/ProductsTable'
import { PlusIcon } from 'lucide-react'

export const Route = createFileRoute('/dashboard/quotation/create')({
  component: RouteComponent,
})

type FormValues = z.infer<typeof quotationSchema>


function RouteComponent() {

    const form = useForm<FormValues>({
        defaultValues: {
        number: "",
        date: "",
        due_date_id: 0,       // como número inicial o "" si prefieres
        company: {
          name: "",
          address: "",
          city: "",
          fiscal_number: "",
          email: "",
          phone: "",
        },
        client: {
          name: "",
          address: "",
          city: "",
          fiscal_number: "",
          email: "",
          phone: "",
        },
        products : []
      },
      resolver : zodResolver(quotationSchema)
  });

  const {fields, append,remove} = useFieldArray({
    control : form.control,
    name : 'products'
  });
  
  const {createQuotation, getDueDates} = useQuotationService();
  const [dueDates, setDueDates] = useState<DueDates[]|[]>([]);
  console.log("Imprimiendo Fields de Products : ", fields)
  const onSubmit = (data : FormValues) => {
    console.log("Imprimiendo Fields de Products : ", fields)
    console.log(data);
    createQuotation(data)
    .catch(() => {
      form.setError('number', { type: 'manual', message: 'Esto es un error de testing' });
    });
  }
  const handleAddProduct = () => {
    append({
      name : '',
      quantity : 1,
      unit : '',
      unit_of_measurement : 'und',
      unit_price : 1,
      description : '',
      discount_percentage : 0,
      tax_percentage : 0
    });
  }
  const handleDeleteProduct = (index : number) => {
      remove(index);
  }

  useEffect(() => {
    getDueDates().then((data) => {
      console.log("Data de getDuedDate desde useEffect: ", data);
      if(data) setDueDates(data);
      
    });
  }, []);

  return (
    <div>
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
                <FieldGroup>
                    {/* FormUploadImage */}

                    {/* FormColorPicker */}
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Información de la empresa</FieldLegend>
                <FieldGroup>
                  <CompanyOrCustomerFormField control={form.control} suffix='company' />
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Información de la Cliente</FieldLegend>
                <FieldGroup>
                  <CompanyOrCustomerFormField control={form.control} suffix='client' />
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldLegend>Productos</FieldLegend>
                <div>
                  <Button type='button' onClick={handleAddProduct}>
                    <PlusIcon/> Agregar
                  </Button>
                </div>
                <FieldGroup>
                  <FieldContent>
                    <ProductsTable products={fields} onDelete={handleDeleteProduct}/>
                  </FieldContent>
                </FieldGroup>
              </FieldSet>

            <Button type='submit'>Hola ! esto es un boton desde Quotation Create</Button>
          </form>
        </CardContent>
      </Card>
      {/*  Quotation Details  */}

       {/* Quotation Custom */} 

      {/* Company details  */} 

       {/* Client Details  */}

      {/* Products  */}

      {/* Extra Information  */}
    </div>
  )
}
