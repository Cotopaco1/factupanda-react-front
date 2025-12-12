import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { TriangleAlertIcon, XIcon } from "lucide-react"
import { useState } from "react"

export function PasswordSetupAlertBanner(){
    const [show, setShow] = useState(true);

    if(!show) return null;

    return (
        <div className="fixed bottom-0  right-0 z-10 flex justify-center">
            <Alert className="bg-warning text-warning-foreground relative m-4 ny-4 px-6 border-warning-foreground border">
                <div onClick={()=>setShow(false)} className="absolute top-0 right-0 bg-warning-foreground text-warning rounded-full m-1 cursor-pointer "> <XIcon size="20"/> </div>
                <TriangleAlertIcon/>
                <AlertTitle>Contraseña no configurada</AlertTitle>
                <AlertDescription>No has configurado la contraseña, porfavor revisa tu bandeja de entrada y sigue las instrucciones.</AlertDescription>
            </Alert>
        </div>
    )
}