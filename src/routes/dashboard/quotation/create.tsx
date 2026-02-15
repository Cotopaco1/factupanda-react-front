import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm, useFieldArray, type Resolver } from "react-hook-form"
import { useEffect, useMemo, useState } from 'react'
import { useQuotationService } from '@/services/quotationService';
import { useTenantSettingsService } from '@/services/tenantSettingsService';
import { useTenantSettingsStore } from '@/stores/tenantSettingsStore';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
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
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { DonationDomainAlertBanner } from '@/components/banners/DonationDomainAlertBanner'
import { useBannerAlertService } from '@/services/bannerAlerts'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type FormValues = z.infer<typeof quotationSchema>

type ChangeItem = {
  section: 'Empresa' | 'Notas y terminos' | 'Apariencia'
  label: string
  current: string
  next: string
}

export const Route = createFileRoute('/dashboard/quotation/create')({
  component: RouteComponent,
})

const templateOptions = [
  { id: 'classic', name: 'Clásico' },
  { id: 'executive', name: 'Ejecutivo' },
  { id: 'modern', name: 'Moderno' },
];

const DEFAULT_COMPANY = {name: "", address: "", city: "", fiscal_number: "", email: "", phone: ""}
const DEFAULT_CUSTOMIZATION = { primaryColor : '#3ab8eb', secundaryColor : '#3ab8eb', template: 'classic' }
const DEFAULT_EXTRAS = { notes: '', terms: '' }

const retreiveCompanyData = (useLocalDefaults = true) => {
    if (!useLocalDefaults) return DEFAULT_COMPANY;
    const company = localStorage.getItem('quotation.company');
    return company ?
      { ...DEFAULT_COMPANY, ...JSON.parse(company) } :
      DEFAULT_COMPANY;
}

const retreiveCustomizationSettings = (useLocalDefaults = true) : {primaryColor : string, secundaryColor : string, template: string} => {
  if (!useLocalDefaults) return DEFAULT_CUSTOMIZATION;
  const customizationSettings = localStorage.getItem('quotation.customization');
  if (!customizationSettings) return DEFAULT_CUSTOMIZATION;
  const parsed = JSON.parse(customizationSettings);
  return {
    primaryColor: parsed.primaryColor ?? DEFAULT_CUSTOMIZATION.primaryColor,
    secundaryColor: parsed.secundaryColor ?? DEFAULT_CUSTOMIZATION.secundaryColor,
    template: parsed.template ?? DEFAULT_CUSTOMIZATION.template,
  };
}

const retreiveExtraSettings = (useLocalDefaults = true) : {notes: string, terms: string} => {
  if (!useLocalDefaults) return DEFAULT_EXTRAS;
  const extraSettings = localStorage.getItem('quotation.extras');
  if (!extraSettings) return DEFAULT_EXTRAS;
  const parsed = JSON.parse(extraSettings);
  return {
    notes: parsed.notes ?? DEFAULT_EXTRAS.notes,
    terms: parsed.terms ?? DEFAULT_EXTRAS.terms,
  };
}

const normalizeTemplate = (template?: string | null) => {
  if (!template) return DEFAULT_CUSTOMIZATION.template;
  return template.replace('template-', '');
}

const retreiveQuotationDefaultValues = (useLocalDefaults = true) : FormValues => {
  const customizationSettings = retreiveCustomizationSettings(useLocalDefaults);
  const extraSettings = retreiveExtraSettings(useLocalDefaults);
  return {
        number: "",
        date: "",
        due_date_id: 0,
        company: retreiveCompanyData(useLocalDefaults),
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
        notes : extraSettings.notes,
        terms : extraSettings.terms,
        ... customizationSettings
  }
}

function RouteComponent() {
  useDocumentTitle('Crear Cotización');
  const isLogin = useUserStore(state => state.isLogin);
  const { get: getTenantSettings } = useTenantSettingsService();
  const tenantSettings = useTenantSettingsStore(state => state.settings);
  const setTenantSettings = useTenantSettingsStore(state => state.setSettings);
  const [loadingTenantSettings, setLoadingTenantSettings] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogTitle, setConfirmDialogTitle] = useState('');
  const [pendingChanges, setPendingChanges] = useState<ChangeItem[]>([]);
  const [pendingApply, setPendingApply] = useState<(() => void) | null>(null);
  const [showSettingsShortcut, setShowSettingsShortcut] = useState(false);

  const defaultValues = useMemo(()=>retreiveQuotationDefaultValues(true), []);
  const form = useForm<FormValues>({
      defaultValues: defaultValues,
    resolver : zodResolver(quotationSchema) as Resolver<FormValues>
  });

  const {fields, append,remove} = useFieldArray({
    control : form.control,
    name : 'products'
  });
  const {incrementQuoteCount, DonationBannerShowedNow, shouldShowDonationBanner} = useBannerAlertService();
  const [pdfOpen, setPdfOpen] = useState(false);
  const [donationDialogOpen, setDonationDialogOpen ] = useState(false);
  const [pdfUrl , setPdfUrl] = useState('');
  const [dialogQuantityOpen, setDialogQuantityOpen] = useState(false);
  const [cbDialogQuantity, setCbDialogQuantity] = useState<(number : number)=>any>(()=>null)
  const {createQuotation, getDueDates , loading:quotationLoading} = useQuotationService();
  const [dueDates, setDueDates] = useState<DueDates[]|[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const onSubmit = (data : FormValues) => {
    console.log(data);
    createQuotation(data)
    .then((file) => {
      setPdfUrl(URL.createObjectURL(file))
      setPdfOpen(true);
      try{
        localStorage.setItem('quotation.company', JSON.stringify(data.company))
        localStorage.setItem('quotation.customization', JSON.stringify({primaryColor : data.primaryColor, secundaryColor : data.secundaryColor, template: data.template}))
        localStorage.setItem('quotation.extras', JSON.stringify({notes: data.notes, terms: data.terms}))
      }catch(error){
        console.log("An error ocurred during saving default values",error )
      }
      
      incrementQuoteCount();
      
      if(shouldShowDonationBanner()){
        // Show dialog
        setDonationDialogOpen(true);
        // Save showed_at key in local storage.
        DonationBannerShowedNow();
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

  const applyCompanyToForm = (company: {name?: string, address?: string, city?: string, fiscal_number?: string, email?: string, phone?: string}) => {
    form.setValue('company.name', company?.name ?? '')
    form.setValue('company.address', company?.address ?? '')
    form.setValue('company.city', company?.city ?? '')
    form.setValue('company.fiscal_number', company?.fiscal_number ?? '')
    form.setValue('company.email', company?.email ?? '')
    form.setValue('company.phone', company?.phone ?? '')
  }

  const buildChanges = (nextValues: {
    company: {name: string, address: string, city: string, fiscal_number: string, email: string, phone: string},
    notes: string,
    terms: string,
    primaryColor: string,
    secundaryColor: string,
    template: string,
  }) => {
    const normalizeForCompare = (value?: string | null) => (value ?? '').trim();
    const normalizeForDisplay = (value?: string | null) => (value ?? '').trim() || 'Sin valor';

    const current = {
      company: {
        name: form.getValues('company.name') ?? '',
        address: form.getValues('company.address') ?? '',
        city: form.getValues('company.city') ?? '',
        fiscal_number: form.getValues('company.fiscal_number') ?? '',
        email: form.getValues('company.email') ?? '',
        phone: form.getValues('company.phone') ?? '',
      },
      notes: form.getValues('notes') ?? '',
      terms: form.getValues('terms') ?? '',
      primaryColor: form.getValues('primaryColor') ?? '',
      secundaryColor: form.getValues('secundaryColor') ?? '',
      template: form.getValues('template') ?? '',
    };

    const changes: ChangeItem[] = [];
    const pushChange = (section: ChangeItem['section'], label: string, currentValue: string, nextValue: string) => {
      if (normalizeForCompare(currentValue) === normalizeForCompare(nextValue)) return;
      changes.push({
        section,
        label,
        current: normalizeForDisplay(currentValue),
        next: normalizeForDisplay(nextValue),
      });
    }

    pushChange('Empresa', 'Nombre', current.company.name, nextValues.company.name);
    pushChange('Empresa', 'Direccion', current.company.address, nextValues.company.address);
    pushChange('Empresa', 'Ciudad', current.company.city, nextValues.company.city);
    pushChange('Empresa', 'Numero fiscal', current.company.fiscal_number, nextValues.company.fiscal_number);
    pushChange('Empresa', 'Email', current.company.email, nextValues.company.email);
    pushChange('Empresa', 'Telefono', current.company.phone, nextValues.company.phone);
    pushChange('Notas y terminos', 'Notas', current.notes, nextValues.notes);
    pushChange('Notas y terminos', 'Terminos', current.terms, nextValues.terms);
    pushChange('Apariencia', 'Color principal', current.primaryColor, nextValues.primaryColor);
    pushChange('Apariencia', 'Color secundario', current.secundaryColor, nextValues.secundaryColor);
    pushChange('Apariencia', 'Plantilla', current.template, nextValues.template);

    return changes;
  }

  const openConfirmDialog = (nextValues: {
    company: {name: string, address: string, city: string, fiscal_number: string, email: string, phone: string},
    notes: string,
    terms: string,
    primaryColor: string,
    secundaryColor: string,
    template: string,
  }, title: string, applyLabel: string, options?: { showSettingsShortcut?: boolean }) => {
    const changes = buildChanges(nextValues);
    if (!changes.length) {
      toast.info('No hay cambios para aplicar');
      return;
    }

    setPendingChanges(changes);
    setConfirmDialogTitle(title);
    setShowSettingsShortcut(Boolean(options?.showSettingsShortcut));
    setPendingApply(() => () => {
      applyCompanyToForm(nextValues.company);
      form.setValue('notes', nextValues.notes);
      form.setValue('terms', nextValues.terms);
      form.setValue('primaryColor', nextValues.primaryColor);
      form.setValue('secundaryColor', nextValues.secundaryColor);
      form.setValue('template', nextValues.template);
      toast.success(applyLabel);
    });
    setConfirmDialogOpen(true);
  }

  const handleLoadTenantSettings = async () => {
    setLoadingTenantSettings(true);
    try {
      let settings = tenantSettings;
      if (!settings) {
        const response = await getTenantSettings();
        settings = response.data.settings;
        setTenantSettings(settings);
      }

      if (!settings) return;

      openConfirmDialog({
        company: {
          name: settings.company?.name || '',
          address: settings.company?.address || '',
          city: settings.company?.city || '',
          fiscal_number: settings.company?.fiscal_number || '',
          email: settings.company?.email || '',
          phone: settings.company?.phone || '',
        },
        notes: settings.quotation?.notes_default ?? '',
        terms: settings.quotation?.terms_default ?? '',
        primaryColor: settings.primary_color || DEFAULT_CUSTOMIZATION.primaryColor,
        secundaryColor: settings.secondary_color || DEFAULT_CUSTOMIZATION.secundaryColor,
        template: normalizeTemplate(settings.template),
      }, 'Confirmar carga desde Empresa', 'Datos de la Empresa cargados', { showSettingsShortcut: true });
    } catch (error) {
      console.error('Error loading tenant settings', error)
      toast.error('No se pudieron cargar los datos pre-configurados')
    } finally {
      setLoadingTenantSettings(false);
    }
  }

  const handleLoadLocalSettings = () => {
    const company = retreiveCompanyData(true);
    const customization = retreiveCustomizationSettings(true);
    const extras = retreiveExtraSettings(true);

    openConfirmDialog({
      company: {
        name: company.name || '',
        address: company.address || '',
        city: company.city || '',
        fiscal_number: company.fiscal_number || '',
        email: company.email || '',
        phone: company.phone || '',
      },
      notes: extras.notes,
      terms: extras.terms,
      primaryColor: customization.primaryColor,
      secundaryColor: customization.secundaryColor,
      template: customization.template,
    }, 'Confirmar carga desde almacenamiento local', 'Datos locales cargados');
  }

  const handleConfirmApply = () => {
    if (pendingApply) pendingApply();
    setConfirmDialogOpen(false);
  }

  /* Limpiar URL hacia el object. watch() */
  useEffect(()=>{
    if(!pdfOpen && pdfUrl) URL.revokeObjectURL(pdfUrl)
  }, [pdfOpen])


  return (
    <div>
      <DonationDomainAlertBanner open={donationDialogOpen} setOpen={setDonationDialogOpen}/>
      <DialogQuantity open={dialogQuantityOpen} setOpen={setDialogQuantityOpen} cb={cbDialogQuantity} />
      <DialogPdfQuotation open={pdfOpen} setOpen={setPdfOpen} url={pdfUrl}/>
      <Dialog
        open={confirmDialogOpen}
        onOpenChange={(open) => {
          setConfirmDialogOpen(open);
          if (!open) {
            setPendingChanges([]);
            setPendingApply(null);
            setConfirmDialogTitle('');
            setShowSettingsShortcut(false);
          }
        }}
      >
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{confirmDialogTitle}</DialogTitle>
            <DialogDescription>
              Revisa los cambios antes de aplicar. Solo se muestran los campos que cambian.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 max-h-[420px] overflow-y-auto pr-1'>
            {(['Empresa', 'Notas y terminos', 'Apariencia'] as ChangeItem['section'][]).map((section) => {
              const sectionChanges = pendingChanges.filter((item) => item.section === section);
              if (!sectionChanges.length) return null;
              return (
                <div key={section} className='grid gap-2'>
                  <div className='text-sm font-semibold'>{section}</div>
                  <div className='grid grid-cols-[minmax(120px,1fr)_minmax(140px,1fr)_minmax(140px,1fr)] gap-2 text-sm'>
                    <div className='text-muted-foreground'>Campo</div>
                    <div className='text-muted-foreground'>Actual</div>
                    <div className='text-muted-foreground'>Nuevo</div>
                    {sectionChanges.map((item) => (
                      <div key={`${section}-${item.label}`} className='contents'>
                        <div>{item.label}</div>
                        <div className='break-words'>{item.current}</div>
                        <div className='break-words'>{item.next}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            {showSettingsShortcut && (
              <Button type='button' variant='outline' asChild>
                <Link to='/dashboard/settings'>Editar configuracion de Empresa</Link>
              </Button>
            )}
            <Button type='button' variant='outline' onClick={() => setConfirmDialogOpen(false)}>Cancelar</Button>
            <Button type='button' onClick={handleConfirmApply}>Aplicar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            {isLogin && (
              <div className='flex flex-wrap gap-2'>
                <div className='flex items-center gap-1.5'>
                  <Button type='button' size='sm' variant='outline' onClick={handleLoadTenantSettings} disabled={loadingTenantSettings}>
                    Cargar datos pre-configurados
                  </Button>
                  <InfoTooltip content='Carga empresa, notas, términos, colores y plantilla desde la configuración de la Empresa.' />
                </div>
                <div className='flex items-center gap-1.5'>
                  <Button type='button' size='sm' variant='outline' onClick={handleLoadLocalSettings}>
                    Pre-cargar desde almacenamiento local
                  </Button>
                  <InfoTooltip content='Usa el último guardado en este navegador al generar cotizaciones.' />
                </div>
              </div>
            )}
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
                    <FormUploadInput control={form.control} label='Logo de la empresa' name='temporary_logo' accept="image/jpeg,image/png,image/webp"/>
                    
                    <FormSelect 
                        name="template"  
                        control={form.control}
                        options={templateOptions}
                        optionLabel='name'
                        optionValue='id'
                        label={
                          <div className="flex items-center gap-2">
                            <span>Diseño del PDF</span>
                            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                              Nuevo
                            </span>
                          </div>
                        }
                    />

                    {/* FormColorPicker */}
                    <div className="md:col-span-2">
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
