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
    cbSelected : (product : Product) => any
}

export function ProductSearchInput({cbSelected}: ProductSearchInputProps){
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const {loading, searchProducts} = useProductService();
    const [historySelected, setHistorySelected] = useState<Product[]>([]);

    const wasSelected = (id:number): boolean => {
        return !!historySelected.find(p => p.id === id);
    }
    /* Products */
    const [products, setProducts] = useState<Product[]|[]>([]);

    const handleSelected = (id : string) => {
        const product = products.find(p => p.id == Number(id));
        if(product){
            cbSelected(product)
            setHistorySelected([...historySelected, product]);
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