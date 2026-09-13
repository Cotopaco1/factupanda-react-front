import type React from "react";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface Props {
    title : string;
    description ?: string;
    children : React.ReactNode;
    className ?: string;
}

/**
 * Encabezado de seccion para formularios largos.
 *
 * FieldLegend y FieldLabel usaban ambos font-medium con solo 2px de diferencia
 * (16px contra 14px), asi que con seis secciones apiladas no se distinguia un
 * titulo de una etiqueta. El contraste se genera en las dos direcciones: el
 * titulo sube a semibold y las etiquetas bajan a peso normal y color atenuado.
 *
 * El titulo y su descripcion van dentro del <legend> a proposito: el elemento
 * debe ser el primer hijo del <fieldset>, asi que no se pueden envolver juntos
 * en un div sin romper la semantica.
 */
export function FormSection({title, description, children, className}: Props){
    return (
        <FieldSet
            className={cn(
                "[&_[data-slot=field-label]]:font-normal",
                /* El campo invalido conserva su color de error. */
                "[&_[data-slot=field]:not([data-invalid=true])_[data-slot=field-label]]:text-muted-foreground",
                className,
            )}
        >
            <FieldLegend className="mb-0 flex w-full flex-col gap-1 border-b pb-3">
                <span className="text-base font-semibold">{title}</span>
                {description && (
                    <span className="text-muted-foreground text-[13px] font-normal">{description}</span>
                )}
            </FieldLegend>
            {children}
        </FieldSet>
    )
}
