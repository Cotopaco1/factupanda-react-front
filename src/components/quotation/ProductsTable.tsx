import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ProductForm } from "@/schemas/quotation"
import { TrashIcon } from "lucide-react"
import type { FieldArray } from "react-hook-form"

type ProductField = FieldArray<ProductForm>

interface Props {
    products : ProductForm[],
    onDelete : (index : number) => void,
}

export function ProductsTable({products, onDelete}:Props) {
  return (
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
        {products.map((product, index) => (
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
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  )
}
