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
import { QuotationDTO } from "@/services/productService"
import { TrashIcon } from "lucide-react"
import type { FieldArray } from "react-hook-form"

type ProductField = FieldArray<ProductForm>

const columns = [
  'Nombre', 'Descripción', 'Unidad de medida', 'Precio Unitario',
  'Cantidad', 'Descuento(%)', 'Impuesto(%)', 'Total'
];

interface Props {
    products : ProductForm[],
    onDelete : (index : number) => void,
}

export function ProductsTable({products, onDelete}:Props) {

  const applyDiscount = (baseAmount : number, discountPercentage : number) => {
    return baseAmount * (discountPercentage / 100);
  }
  const applyTax = (subTotal : number, taxPercentage : number) => {
    return subTotal * (taxPercentage / 100);
  }
  const calculateProductTotal = (prod : ProductForm) => {
    if(!prod.quantity || !prod.unit_price) return 0;
      const baseAmount = prod.quantity * prod.unit_price;
      let subTotal = baseAmount;
      if(prod.discount_percentage && prod.discount_percentage > 0) {
        subTotal = applyDiscount(prod.quantity * prod.unit_price, prod.discount_percentage);
      }
      let total = subTotal;
      if(prod.tax_percentage && prod.tax_percentage > 0) {
         total = applyTax(subTotal, prod.tax_percentage );
      }
      return total;
  }

  // SubTotal, Total.
  // const total = products.reduce((accumulator, prod)=>{
  //   if(prod.quantity && prod.unit_price ){
  //     return accumulator += calculateProductTotal(prod);
  //   }
  //   return accumulator 
  // }, 0);

  const quotationDto = new QuotationDTO(products);

  console.log("Total :", quotationDto.total);

  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">
           Acciones
          </TableHead>
          {columns.map(col => <TableHead className="min-w-[200px]">{col}</TableHead>)}
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
            {/* <TableCell>{ product.quantity && product.unit_price ? calculateProductTotal(product) : 0 }</TableCell> */}
            <TableCell>${ product.quantity && product.unit_price ? quotationDto.calculateProductTotal(product).total.toLocaleString() : 0 }</TableCell>
          </TableRow>
        ))}
      </TableBody>

    </Table>
    <div className="my-4 flex justify-end">
        <div className="flex flex-col">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Base : </TableCell>
                <TableCell>${quotationDto.baseAmount.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Descuento : </TableCell>
                <TableCell>${quotationDto.discountAmount.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Subtotal : </TableCell>
                <TableCell>${quotationDto.subTotal.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Impuesto : </TableCell>
                <TableCell>${quotationDto.taxAmount.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Total : </TableCell>
                <TableCell>${quotationDto.total.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
    </div>
    </>
  )
}
