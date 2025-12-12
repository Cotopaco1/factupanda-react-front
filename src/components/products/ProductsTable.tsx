import {
  Table,
  TableBody,
  TableCaption,
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

interface ProductsTableProps {
  page: number
  perPage: number
}


export function ProductsTable({ page, perPage }: ProductsTableProps) {
  const {list, loading} = useProductService();
  const [paginator, setPaginator] = useState<LaravelPaginator<Product>>();
      
  useEffect(()=>{
    const filters = {per_page : perPage, page : page};
    list(null, filters).then(response => {
      setPaginator(response.data);
    });
  }, [page, perPage])

  if(loading) return <p>Cargandoo....</p>

  return (
    <div>

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
                  <TrashIcon className="cursor-pointer hover:text-destructive transition-colors" onClick={()=>onDelete(index)}/>
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
