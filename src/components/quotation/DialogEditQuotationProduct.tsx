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
import {
  type ProductFormInput,
  productSchema,
} from "@/schemas/quotation";
import { ProductFormFields } from "@/components/products/ProductFormFields";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: ProductFormInput | null;
  onSubmit: (data: ProductFormInput) => void;
}

export function DialogEditQuotationProduct({
  open,
  setOpen,
  product,
  onSubmit,
}: Props) {
  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      description: "",
      discount_percentage: 0,
      name: "",
      quantity: 1,
      tax_percentage: 0,
      unit_of_measurement: "",
      unit_price: 0,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (!product) {
      form.reset({
        description: "",
        discount_percentage: 0,
        name: "",
        quantity: 1,
        tax_percentage: 0,
        unit_of_measurement: "",
        unit_price: 0,
      });
      return;
    }
    form.reset({
      description: product.description ?? "",
      discount_percentage: product.discount_percentage ?? 0,
      name: product.name ?? "",
      quantity: product.quantity ?? 1,
      tax_percentage: product.tax_percentage ?? 0,
      unit_of_measurement: product.unit_of_measurement ?? "",
      unit_price: product.unit_price ?? 0,
    });
  }, [open, product, form]);

  const handleSubmit = (data: ProductFormInput) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-description="Edita los datos del producto" className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>
            Actualiza los datos para esta cotización.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
          <div className="grid md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-2">
            <ProductFormFields control={form.control} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={form.handleSubmit(handleSubmit)}>
              Actualizar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
