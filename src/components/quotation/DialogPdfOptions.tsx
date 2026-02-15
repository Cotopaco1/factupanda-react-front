import type React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FormSelect } from "@/components/form/FormSelect";
import { FormColorInput } from "@/components/form/FormColorInput";
import { ButtonLoader } from "@/components/ButtonLoader";
import { useForm } from "react-hook-form";
import type { GeneratePdfPayload } from "@/types/quotation";

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onGenerate: (options: GeneratePdfPayload) => void;
    loading: boolean;
}

const templateOptions = [
    { value: 'classic', label: 'Clásico' },
    { value: 'executive', label: 'Ejecutivo' },
    { value: 'modern', label: 'Moderno' },
];

export function DialogPdfOptions({ open, setOpen, onGenerate, loading }: Props) {
    const { control, handleSubmit } = useForm<GeneratePdfPayload>({
        defaultValues: {
            template: 'classic',
            primaryColor: '#000000',
            secundaryColor: '#666666',
        }
    });

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
