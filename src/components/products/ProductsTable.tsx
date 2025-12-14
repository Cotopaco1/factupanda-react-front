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
import { TrashIcon } from "lucide-react"
import { useProductService } from "@/services/productService"
import { useEffect, useState } from "react"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface ProductsTableProps {
  page: number
  perPage: number
}


export function ProductsTable({ page, perPage }: ProductsTableProps) {
  const {list, loading, deleteById} = useProductService();
  const [open, setOpen] = useState(false);
  const [cbDelete, setCbDelete] = useState<()=>void>();
  const [paginator, setPaginator] = useState<LaravelPaginator<Product>>();
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
            Acciones
            </TableHead>
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
              <TableCell >
                  <TrashIcon className="cursor-pointer hover:text-destructive transition-colors" onClick={()=>handleDeleteClick(product.id)}/>
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.unit_of_measurement}</TableCell>
              <TableCell>{product.unit_price}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.discount_percentage}</TableCell>
              <TableCell>{product.tax_percentage}</TableCell>
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
