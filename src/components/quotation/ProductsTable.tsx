import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ProductForm, ProductFormInput } from "@/schemas/quotation"
import { QuotationDTO } from "@/services/productService"
import { PencilIcon, TrashIcon } from "lucide-react"
import { DialogEditQuotationProduct } from "@/components/quotation/DialogEditQuotationProduct"
import { useState } from "react"

const columns = [
  'Nombre', 'Descripción', 'Unidad de medida', 'Precio Unitario',
  'Cantidad', 'Descuento(%)', 'Impuesto(%)', 'Total'
];

interface Props {
    products : ProductForm[],
    onDelete : (index : number) => void,
    onUpdate : (index : number, data: ProductForm) => void,
}

export function ProductsTable({products, onDelete, onUpdate}:Props) {

  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductFormInput | null>(null);

  const handleEditClick = (product: ProductForm, index: number) => {
    setSelectedProduct(product as ProductFormInput);
    setEditIndex(index);
    setEditOpen(true);
  }

  const handleUpdateProduct = (data: ProductFormInput) => {
    if (editIndex === null) return;
    onUpdate(editIndex, data as ProductForm);
    setEditOpen(false);
    setSelectedProduct(null);
    setEditIndex(null);
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
    <DialogEditQuotationProduct
      open={editOpen}
      setOpen={setEditOpen}
      product={selectedProduct}
      onSubmit={handleUpdateProduct}
    />
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
            <TableCell className="flex items-center gap-2">
                 <button type="button" onClick={() => handleEditClick(product, index)} className="cursor-pointer">
                   <PencilIcon className="hover:text-primary transition-colors" />
                 </button>
                 <button type="button" onClick={()=>onDelete(index)} className="cursor-pointer">
                   <TrashIcon className="hover:text-destructive transition-colors" />
                 </button>
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell>{product.unit_of_measurement}</TableCell>
            <TableCell>{Number(product.unit_price)}</TableCell>
            <TableCell>{Number(product.quantity)}</TableCell>
            <TableCell>{Number(product.discount_percentage ?? 0)}</TableCell>
            <TableCell>{Number(product.tax_percentage ?? 0)}</TableCell>
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
