import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type React from "react"
import { Button } from "../ui/button"
import { ProductFormFields } from "./ProductFormFields"
import { useForm } from "react-hook-form"
import { type ProductForm, type ProductFormInput, productSchema } from "@/schemas/quotation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"

interface Props {
    open : boolean,
    setOpen : React.Dispatch<React.SetStateAction<boolean>>
    cbAdd : (data : ProductForm) => void,
}


export function DialogProductForm({open, setOpen, cbAdd}:Props){

    useEffect(() => {
        if(!open) form.reset();
    }, [open]);

    const form = useForm<ProductFormInput>({
        resolver : zodResolver(productSchema),
        defaultValues : {
            description : '',
            discount_percentage : 0,
            name : '',
            quantity : 1,
            tax_percentage : 0,
            unit_of_measurement : '',
            unit_price : 0
        }
    });

    const onSubmit = (data : ProductFormInput) => {
        const parsed = productSchema.parse(data);
        cbAdd(parsed);
        form.reset();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent aria-description="Agrega un nuevo producto" className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Agregar producto</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="grid md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-2">
                        <ProductFormFields control={form.control}  />
                    </div>
                    <DialogFooter>
                        <Button type='button' onClick={() => setOpen(false)} variant="destructive">Cancelar</Button>
                        <Button type='submit' >Agregar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
