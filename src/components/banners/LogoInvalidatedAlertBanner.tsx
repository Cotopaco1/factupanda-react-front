import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useTenantSettingsStore } from "@/stores/tenantSettingsStore"
import { Link } from "@tanstack/react-router"
import { ImageOffIcon, XIcon } from "lucide-react"
import { useState } from "react"

/**
 * Explica por que desaparecio el logo de la empresa.
 *
 * Sin esto el usuario solo ve que no tiene logo configurado, sin saber que se
 * lo retiramos nosotros ni por que: subieron una imagen cuya resolucion el
 * sistema no puede procesar, antes de que existiera el limite.
 */
export function LogoInvalidatedAlertBanner() {
    const invalidated = useTenantSettingsStore((state) => state.settings?.logo_invalidated)
    const [dismissed, setDismissed] = useState(false)

    if (!invalidated || dismissed) return null

    return (
        <Alert className="border-warning-foreground/40 bg-warning/10 relative">
            <ImageOffIcon className="size-4" />
            <AlertTitle>Tu logo fue retirado</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
                <span>
                    La imagen que tenías ({invalidated.width}×{invalidated.height}, {invalidated.megapixels} megapíxeles)
                    supera los {invalidated.max_megapixels} megapíxeles que podemos procesar, así que tus cotizaciones
                    se están generando sin logo. Sube una más pequeña para recuperarlo.
                </span>
                <div>
                    <Button size="sm" asChild>
                        <Link to="/dashboard/settings">Subir un logo nuevo</Link>
                    </Button>
                </div>
            </AlertDescription>
            <button
                type="button"
                aria-label="Descartar aviso"
                onClick={() => setDismissed(true)}
                className="text-muted-foreground hover:text-foreground absolute top-2 right-2 cursor-pointer"
            >
                <XIcon className="size-4" />
            </button>
        </Alert>
    )
}
