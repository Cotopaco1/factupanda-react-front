import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { AuthCard } from "./AuthCard"
import { Button } from "../ui/button"
import { useState } from "react"


export function AuthDialog(){
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" className="w-full">Iniciar Sesión</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle hidden>Inicia sesion, registrate o recupera la contraseña</DialogTitle>
                <AuthCard onLogin={()=>setOpen(false)}/>
            </DialogContent>
        </Dialog>
    )
}