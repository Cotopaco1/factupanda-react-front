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
import { useAuthDialogStore } from "@/stores/authDialog"


export function AuthDialog(){
    const isOpen = useAuthDialogStore(state=>state.isOpen);
    const setIsOpen = useAuthDialogStore(state=>state.setIsOpen);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" className="w-full">Iniciar Sesión</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle hidden>Inicia sesion, registrate o recupera la contraseña</DialogTitle>
                <AuthCard onLogin={()=>setIsOpen(false)}/>
            </DialogContent>
        </Dialog>
    )
}