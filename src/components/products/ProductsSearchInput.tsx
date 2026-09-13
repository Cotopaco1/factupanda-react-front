import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { ChevronsUpDown } from "lucide-react"
import type { Product } from "@/types/products"
import { useProductService } from "@/services/productService"
import { Spinner } from "../ui/spinner"


type ProductSearchInputProps = {
    cbSelected : (product : Product) => void,
    /**
     * Ids de los productos que ya estan en la cotizacion. Se recibe desde el
     * formulario en vez de llevar una lista propia: la lista local solo crecia,
     * asi que un producto eliminado seguia bloqueado, y uno cuyo dialogo de
     * cantidad se cancelaba quedaba bloqueado sin haberse agregado nunca.
     */
    selectedProductIds ?: ReadonlySet<number>,
}

export function ProductSearchInput({cbSelected, selectedProductIds}: ProductSearchInputProps){
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const {loading, searchProducts} = useProductService();

    const wasSelected = (id:number): boolean => {
        return selectedProductIds?.has(id) ?? false;
    }
    /* Products */
    const [products, setProducts] = useState<Product[]|[]>([]);

    const handleSelected = (id : string) => {
        const product = products.find(p => p.id == Number(id));
        if(product){
            cbSelected(product)
        }
    }

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(()=>{
        // if (debouncedSearchTerm.trim() === "") {
        //     setProducts([]);
        //     return;
        // }
        
        searchProducts(debouncedSearchTerm)
            .then((data) => {
                setProducts(data.data.data);
            })
    }, [debouncedSearchTerm]);
    
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Seleccionar producto
          {loading ? <Spinner /> : <ChevronsUpDown className="opacity-50" />}
          
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput value={searchTerm} onValueChange={setSearchTerm}  placeholder="Busque un producto ..." className="h-9" />
          <CommandList className="max-h-60 overflow-auto">
            <CommandEmpty>Sin resultados...</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                    disabled={wasSelected(product.id)}
                  key={product.id}
                  value={String(product.id)}
                  onSelect={handleSelected}
                  
                >
                  {product.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}