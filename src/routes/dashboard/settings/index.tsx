import { ButtonLoader } from '@/components/ButtonLoader'
import { DashboardLayout, type BreadcrumbItemType } from '@/components/layouts/DashboardLayout'
import { FormColorInput } from '@/components/form/FormColorInput'
import { FormInput } from '@/components/form/FormInput'
import { FormSelect } from '@/components/form/FormSelect'
import { FormRootErrorMessage } from '@/components/form/FormRootErrorMessage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { tenantSettingsSchema, type TenantSettingsForm } from '@/schemas/tenantSettings'
import { MergeServerErrorsToForm } from '@/services/errorService'
import { useTenantSettingsService } from '@/services/tenantSettingsService'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/dashboard/settings/')({
  component: RouteComponent,
})

const breadcrumb: BreadcrumbItemType[] = [
  {
    label: 'Configuración',
    to: '/dashboard/settings'
  }
]

// TODO: Activar estos campos cuando estén listos
const SHOW_LOGO_URL = false;
const SHOW_REGIONAL_SETTINGS = false;

const templateOptions = [
  { value: 'classic', label: 'Clásico' },
  { value: 'executive', label: 'Ejecutivo' },
  { value: 'modern', label: 'Moderno' },
]

const localeOptions = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
]

const currencyOptions = [
  { value: 'USD', label: 'USD - Dólar estadounidense' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'MXN', label: 'MXN - Peso mexicano' },
  { value: 'COP', label: 'COP - Peso colombiano' },
  { value: 'ARS', label: 'ARS - Peso argentino' },
  { value: 'CLP', label: 'CLP - Peso chileno' },
  { value: 'PEN', label: 'PEN - Sol peruano' },
]

function RouteComponent() {
  useDocumentTitle('Configuración');
  const { get, update, loading } = useTenantSettingsService();
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<TenantSettingsForm>({
    defaultValues: {
      logo_url: '',
      primary_color: '#3B82F6',
      secondary_color: '#1E40AF',
      template: 'classic',
      currency: 'USD',
      locale: 'es',
      company: {
        name: '',
        address: '',
        phone: '',
        city: '',
        fiscal_number: '',
        email: '',
      }
    },
    resolver: zodResolver(tenantSettingsSchema),
  });

  useEffect(() => {
    get().then(response => {
      const settings = response.data.settings;
      form.reset({
        logo_url: settings.logo_url || '',
        primary_color: settings.primary_color || '#3B82F6',
        secondary_color: settings.secondary_color || '#1E40AF',
        template: (settings.template?.replace('template-', '') as 'classic' | 'executive' | 'modern') || 'classic',
        currency: settings.currency || 'USD',
        locale: settings.locale || 'es',
        company: {
          name: settings.company?.name || '',
          address: settings.company?.address || '',
          phone: settings.company?.phone || '',
          city: settings.company?.city || '',
          fiscal_number: settings.company?.fiscal_number || '',
          email: settings.company?.email || '',
        }
      });
    }).catch(() => {
      toast.error("Error al cargar la configuración");
    }).finally(() => {
      setInitialLoading(false);
    });
  }, []);

  const onSubmit = (data: TenantSettingsForm) => {
    update(data).then(() => {
      toast.success("Configuración guardada");
    }).catch(async (error) => {
      await MergeServerErrorsToForm(error, form);
    });
  }

  if (initialLoading) {
    return (
      <DashboardLayout title='Configuración' description='Cargando...' breadcrumb={breadcrumb}>
        <div className="flex items-center justify-center py-10">
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title='Configuración' description='Configura los datos predeterminados para tus cotizaciones' breadcrumb={breadcrumb}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
        <FormRootErrorMessage form={form} />

        <Card>
          <CardHeader>
            <CardTitle>Apariencia</CardTitle>
            <CardDescription>Personaliza el aspecto de tus cotizaciones</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='grid md:grid-cols-2 gap-4'>
              {SHOW_LOGO_URL && (
                <FormInput
                  name='logo_url'
                  control={form.control}
                  label='URL del Logo'
                  type='url'
                  placeholder='https://ejemplo.com/logo.png'
                />
              )}
              <FormSelect
                name='template'
                control={form.control}
                label='Plantilla'
                options={templateOptions}
                optionLabel='label'
                optionValue='value'
              />
            </div>
            <div className='flex flex-wrap gap-6'>
              <FormColorInput
                name='primary_color'
                control={form.control}
                label='Color Primario'
              />
              <FormColorInput
                name='secondary_color'
                control={form.control}
                label='Color Secundario'
              />
            </div>
          </CardContent>
        </Card>

        {SHOW_REGIONAL_SETTINGS && (
          <Card>
            <CardHeader>
              <CardTitle>Preferencias Regionales</CardTitle>
              <CardDescription>Configura el idioma y la moneda predeterminada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid md:grid-cols-2 gap-4'>
                <FormSelect
                  name='locale'
                  control={form.control}
                  label='Idioma'
                  options={localeOptions}
                  optionLabel='label'
                  optionValue='value'
                />
                <FormSelect
                  name='currency'
                  control={form.control}
                  label='Moneda'
                  options={currencyOptions}
                  optionLabel='label'
                  optionValue='value'
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Datos de la Empresa</CardTitle>
            <CardDescription>Esta información aparecerá en tus cotizaciones como datos del emisor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-2 gap-4'>
              <FormInput
                name='company.name'
                control={form.control}
                label='Nombre de la Empresa'
                type='text'
                placeholder='Mi Empresa S.A.'
              />
              <FormInput
                name='company.fiscal_number'
                control={form.control}
                label='Número Fiscal / NIT / RUC'
                type='text'
                placeholder='123456789'
              />
              <FormInput
                name='company.email'
                control={form.control}
                label='Email'
                type='email'
                placeholder='contacto@miempresa.com'
              />
              <FormInput
                name='company.phone'
                control={form.control}
                label='Teléfono'
                type='tel'
                placeholder='+1 555 0123'
              />
              <FormInput
                name='company.address'
                control={form.control}
                label='Dirección'
                type='text'
                placeholder='Calle Principal 123'
              />
              <FormInput
                name='company.city'
                control={form.control}
                label='Ciudad'
                type='text'
                placeholder='Ciudad'
              />
            </div>
          </CardContent>
        </Card>

        <div className='flex justify-end'>
          <ButtonLoader loading={loading}>Guardar Configuración</ButtonLoader>
        </div>
      </form>
    </DashboardLayout>
  )
}
