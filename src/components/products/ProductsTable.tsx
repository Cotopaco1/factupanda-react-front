import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { LaravelPaginator } from "@/types/paginator"
import type { Product } from "@/types/products"
import { PencilIcon, TrashIcon } from "lucide-react"
import { useProductService } from "@/services/productService"
import { useEffect, useState } from "react"
import { DialogEditProduct } from "@/components/products/DialogEditProduct"
import type { ProductCreateFormInput } from "@/schemas/products"
import { TablePagination } from "../TablePagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface ProductsTableProps {
  page: number
  perPage: number
}


export function ProductsTable({ page, perPage }: ProductsTableProps) {
  const {list, loading, deleteById, update} = useProductService();
  const [open, setOpen] = useState(false);
  const [cbDelete, setCbDelete] = useState<()=>void>();
  const [paginator, setPaginator] = useState<LaravelPaginator<Product>>();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const handleDeleteClick = (id:number) => {
    setCbDelete(() => {
      return () => deleteById(id).then(()=> {
        toast.success("Producto Eliminado")
        setCbDelete(()=>null);
        getProducts({per_page : perPage, page : page})
      })
    })
    setOpen(true);
  }
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditOpen(true);
  }
  const handleUpdateProduct = async (data: ProductCreateFormInput) => {
    if (!selectedProduct) return;
    await update(selectedProduct.id, data);
    toast.success("Producto actualizado");
    setEditOpen(false);
    setSelectedProduct(null);
    getProducts({per_page : perPage, page : page});
  }
  const getProducts = (filters : {per_page : number, page : number}) => {
    return list(null, filters).then(response => {
      setPaginator(response.data);
    });
  }
  useEffect(()=>{
    const filters = {per_page : perPage, page : page};
    getProducts(filters);
  }, [page, perPage])

  if(loading) return <p className="p-4 ">Cargandoo....</p>

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estas seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no es reversible
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={cbDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DialogEditProduct
        open={editOpen}
        setOpen={setEditOpen}
        product={selectedProduct}
        onSubmit={handleUpdateProduct}
        loading={loading}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px] text-center">Acciones</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Unidad de medida</TableHead>
            <TableHead className="text-right">Precio Unitario</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">Descuento(%)</TableHead>
            <TableHead className="text-right">Impuesto(%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginator?.data.map((product, index) => (
            <TableRow key={`${product.name}-${index}`}>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <button type="button" onClick={() => handleEditClick(product)} className="cursor-pointer">
                    <PencilIcon className="hover:text-primary transition-colors" />
                  </button>
                  <button type="button" onClick={()=>handleDeleteClick(product.id)} className="cursor-pointer">
                    <TrashIcon className="hover:text-destructive transition-colors" />
                  </button>
                </div>
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell className="text-right">{product.unit_of_measurement}</TableCell>
              <TableCell className="text-right">{product.unit_price}</TableCell>
              <TableCell className="text-right">{product.quantity}</TableCell>
              <TableCell className="text-right">{product.discount_percentage}</TableCell>
              <TableCell className="text-right">{product.tax_percentage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          
        </TableFooter> */}
      </Table>
      <div>
        <TablePagination paginator={paginator}></TablePagination>
      </div>
    </div>
  )
}
