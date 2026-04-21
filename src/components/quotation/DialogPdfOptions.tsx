import type React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Switch } from "@/components/ui/switch";
import { FormSelect } from "@/components/form/FormSelect";
import { FormColorInput } from "@/components/form/FormColorInput";
import { ButtonLoader } from "@/components/ButtonLoader";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { GeneratePdfPayload } from "@/types/quotation";
import { useTenantSettingsStore } from "@/stores/tenantSettingsStore";
import { toast } from "sonner";
import { useCurrencyService } from "@/services/currencyService";
import { useCurrencyStore } from "@/stores/currencyStore";
import { DEFAULT_CURRENCY_CODE, mapCurrenciesToSelectOptions } from "@/lib/currency";

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onGenerate: (options: GeneratePdfPayload) => void;
    loading: boolean;
    initialCurrency?: string;
    hideCurrencySelect?: boolean;
}

const templateOptions = [
    { value: 'classic', label: 'Clásico' },
    { value: 'executive', label: 'Ejecutivo' },
    { value: 'modern', label: 'Moderno' },
];

export function DialogPdfOptions({ open, setOpen, onGenerate, loading, initialCurrency, hideCurrencySelect = false }: Props) {
    const tenantSettings = useTenantSettingsStore((state) => state.settings);
    const { list: listCurrencies } = useCurrencyService();
    const currencies = useCurrencyStore((state) => state.currencies);
    const hasLoadedCurrencies = useCurrencyStore((state) => state.hasLoaded);
    const setCurrencies = useCurrencyStore((state) => state.setCurrencies);
    const setCurrenciesLoaded = useCurrencyStore((state) => state.setHasLoaded);
    const hasTenantLogo = Boolean(tenantSettings?.logo?.url);
    const currencyOptions = mapCurrenciesToSelectOptions(currencies);
    const { control, handleSubmit, reset, watch, setValue } = useForm<GeneratePdfPayload>({
        defaultValues: {
            template: 'classic',
            primaryColor: '#000000',
            secundaryColor: '#666666',
            use_tenant_logo: false,
            currency: initialCurrency || tenantSettings?.currency || DEFAULT_CURRENCY_CODE,
        }
    });

    useEffect(() => {
        if (hasLoadedCurrencies) return;

        listCurrencies()
            .then((response) => {
                setCurrencies(response.data.currencies ?? []);
                setCurrenciesLoaded(true);
            })
            .catch(() => {
                setCurrenciesLoaded(true);
                toast.error('No se pudo cargar el catálogo de monedas');
            });
    }, [hasLoadedCurrencies, listCurrencies, setCurrencies, setCurrenciesLoaded]);

    useEffect(() => {
        if (!open) return;
        const template = (tenantSettings?.template?.replace('template-', '') as 'classic' | 'executive' | 'modern') || 'classic'
        reset({
            template,
            primaryColor: tenantSettings?.primary_color || '#000000',
            secundaryColor: tenantSettings?.secondary_color || '#666666',
            use_tenant_logo: false,
            currency: initialCurrency || tenantSettings?.currency || DEFAULT_CURRENCY_CODE,
        })
    }, [initialCurrency, open, reset, tenantSettings]);

    const onSubmit = (data: GeneratePdfPayload) => {
        onGenerate(data);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Opciones del PDF</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormSelect
                        label="Plantilla"
                        control={control}
                        name="template"
                        options={templateOptions}
                        optionLabel="label"
                        optionValue="value"
                    />
                    {!hideCurrencySelect && (
                        <FormSelect
                            label="Moneda"
                            control={control}
                            name="currency"
                            options={currencyOptions}
                            optionLabel="label"
                            optionValue="value"
                        />
                    )}
                    <div className="flex gap-4">
                        <FormColorInput
                            label="Color primario"
                            control={control}
                            name="primaryColor"
                        />
                        <FormColorInput
                            label="Color secundario"
                            control={control}
                            name="secundaryColor"
                        />
                    </div>
                    <label className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Switch
                        checked={Boolean(watch('use_tenant_logo'))}
                        onCheckedChange={(checked) => {
                          if (!hasTenantLogo) {
                            toast.error('Configura el logo en Configuración para usarlo')
                            setValue('use_tenant_logo', false, { shouldDirty: true })
                            return
                          }
                          setValue('use_tenant_logo', checked, { shouldDirty: true })
                        }}
                      />
                      Usar logo guardado de la empresa
                    </label>
                    <div className="flex justify-end">
                        <ButtonLoader loading={loading}>
                            Generar PDF
                        </ButtonLoader>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
