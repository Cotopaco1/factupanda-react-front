# Sugerencias de Mejoras - Componente Quotation Create

## 1. useCallback para Handlers (Prioridad Alta)

**Problema:** Re-renderizados innecesarios de componentes hijos
**Solución:** Memoizar funciones que se pasan como props

```typescript
// ❌ Antes
const handleDeleteProduct = (index : number) => {
    remove(index);
}

// ✅ Después  
const handleDeleteProduct = useCallback((index: number) => {
    remove(index);
}, [remove]);

const cbProductSearch = useCallback((product: Product) => {
    setSelectedProduct(product);
    setDialogQuantityOpen(true);
}, []);
```

## 2. Eliminar Callback en Estado (Prioridad Alta)

**Problema:** Almacenar funciones en estado es anti-patrón
**Solución:** useRef + datos contextuales

```typescript
// ❌ Antes
const [cbDialogQuantity, setCbDialogQuantity] = useState<(number : number)=>any>(()=>null)

const cbProductSearch = (product : Product) => {
    setCbDialogQuantity(()=>{
        return (number : number)=>append({...product, quantity : number});
    })
    setDialogQuantityOpen(true);
}

// ✅ Después
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

const cbProductSearch = useCallback((product: Product) => {
    setSelectedProduct(product);
    setDialogQuantityOpen(true);
}, []);

const handleQuantitySubmit = useCallback((quantity: number) => {
    if (selectedProduct) {
        append({...selectedProduct, quantity});
        setDialogQuantityOpen(false);
        setSelectedProduct(null);
    }
}, [append, selectedProduct]);
```

## 3. Custom Hook para Dialogs (Prioridad Media)

**Problema:** Lógica de dialogs dispersa en el componente principal
**Solución:** Extraer a custom hook reutilizable

```typescript
// ✅ Nuevo hook
const useDialogs = () => {
    const [states, setState] = useState({
        product: false,
        pdf: false,
        quantity: false
    });

    const open = useCallback((dialog: keyof typeof states) => {
        setState(prev => ({ ...prev, [dialog]: true }));
    }, []);

    const close = useCallback((dialog: keyof typeof states) => {
        setState(prev => ({ ...prev, [dialog]: false }));
    }, []);

    return { states, open, close };
};

// ✅ En el componente
const { states: dialogs, open, close } = useDialogs();

<DialogQuantity 
    open={dialogs.quantity} 
    setOpen={() => close('quantity')} 
    onSubmit={handleQuantitySubmit}
/>
```

## 4. Extraer Lógica de Negocio (Prioridad Media)

**Problema:** Componente de 270 líneas mezcla UI y lógica
**Solución:** Custom hook para lógica de cotización

```typescript
// ✅ Nuevo hook
const useQuotationForm = () => {
    const defaultValues = useMemo(()=>retreiveQuotationDefaultValues(), []);
    const form = useForm<FormValues>({
        defaultValues,
        resolver: zodResolver(quotationSchema)
    });

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: 'products'
    });

    const [pdfUrl, setPdfUrl] = useState('');
    const [dueDates, setDueDates] = useState<DueDates[]>([]);
    
    // Toda la lógica de submit, efectos, etc.
    
    return {
        form,
        fields,
        append,
        remove,
        pdfUrl,
        dueDates,
        onSubmit,
        // otros handlers...
    };
};
```

## 5. Memoizar Componentes Pesados (Prioridad Baja)

**Problema:** ProductsTable se re-renderiza innecesariamente
**Solución:** React.memo en componentes hijos

```typescript
// ✅ En ProductsTable
export const ProductsTable = React.memo(({ products, onDelete }) => {
    // componente...
});

// ✅ En el componente padre
const memoizedProducts = useMemo(() => fields, [fields]);

<ProductsTable 
    products={memoizedProducts} 
    onDelete={handleDeleteProduct}
/>
```

## Impacto de las Mejoras

- **Performance:** Menos re-renderizados innecesarios
- **Mantenibilidad:** Código más organizado y reutilizable  
- **Legibilidad:** Lógica separada de presentación
- **Testing:** Hooks extraídos son más fáciles de testear
- **Escalabilidad:** Patrones consistentes para futuras features

## Orden de Implementación Sugerido

1. useCallback en handlers (fácil, alto impacto)
2. Eliminar callback en estado (medio, alto impacto)  
3. Custom hook para dialogs (medio, medio impacto)
4. Extraer lógica de negocio (difícil, alto impacto a largo plazo)