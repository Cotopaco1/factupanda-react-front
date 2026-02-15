import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { Product } from "@/types/products";
import {
  type ProductCreateFormInput,
  productCreateSchema,
} from "@/schemas/products";
import { PersistentProductFormFields } from "./PersistentProductFormFields";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: Product | null;
  onSubmit: (data: ProductCreateFormInput) => void;
  loading?: boolean;
}

export function DialogEditProduct({
  open,
  setOpen,
  product,
  onSubmit,
  loading = false,
}: Props) {
  const form = useForm<ProductCreateFormInput>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      description: "",
      discount_percentage: 0,
      name: "",
      tax_percentage: 0,
      unit_of_measurement: "",
      unit_price: 1,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (!product) {
      form.reset({
        description: "",
        discount_percentage: 0,
        name: "",
        tax_percentage: 0,
        unit_of_measurement: "",
        unit_price: 1,
      });
      return;
    }
    form.reset({
      description: product.description ?? "",
      discount_percentage: product.discount_percentage ?? 0,
      name: product.name ?? "",
      tax_percentage: product.tax_percentage ?? 0,
      unit_of_measurement: product.unit_of_measurement ?? "",
      unit_price: product.unit_price ?? 1,
    });
  }, [open, product, form]);

  const handleSubmit = (data: ProductCreateFormInput) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-description="Edita los datos del producto">
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>
            Actualiza los datos y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <PersistentProductFormFields control={form.control} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              Actualizar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
