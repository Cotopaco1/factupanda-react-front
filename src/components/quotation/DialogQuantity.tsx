import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader, Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { z } from "zod";
import { FieldError } from "../ui/field";

const quantitySchema = z.number().min(1, "La cantidad debe ser mayor a 0").max(10000, "La cantidad es demasiado alta");

type Props = {
    open : boolean;
    setOpen : React.Dispatch<React.SetStateAction<boolean>>,
    cb : (number : number) => any
}
export function DialogQuantity({open, setOpen, cb}:Props) {
    const [value, setValue] = useState(1);
    const [error, setError] = useState<{message : string}>({message : ''});
    
    const handleConfirm = () => {
        const validation = quantitySchema.safeParse(value);
        
        if (!validation.success) {
            setError(validation.error.issues[0]);
            return;
        }
        
        setError({ message : ''});
        cb(value);
        setOpen(false);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Indique la cantidad para este producto</DialogTitle>
                </DialogHeader>
                <div>
                    <Input 
                        value={value} 
                        onChange={(event) => {
                            setValue(Number(event.target.value));
                            if (error) setError({message : ''});
                        }} 
                        min="1" 
                        type="number" 
                    />
                    {error && <FieldError errors={[error]}/>}
                </div>
                <DialogFooter>
                    <Button variant="destructive" onClick={()=>setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleConfirm}>Confirmar</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}