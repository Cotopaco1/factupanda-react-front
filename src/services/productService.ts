import { apiClient } from "@/lib/apiClient";
import type { ProductForm } from "@/schemas/quotation";
import type { LaravelPaginator } from "@/types/paginator";
import type { Product } from "@/types/products";
import type { ApiResponse } from "@/types/responses";
import { useState } from "react"

export const useProductService = () => {

    const [loading, setLoading] = useState(false);

    // Manage loading state
    const handleFetch = async <T>(cb: () => Promise<T>): Promise<T> => {
        setLoading(true);
        try {
            const result = await cb();
            return result;
        }
        finally {
            setLoading(false);
        }
    }

    const create = (data) => {
        return handleFetch(async () => {
            const response = await apiClient.post<ApiResponse<{ product: Product }>>('/products', data)
            return response.data;
        });

    }

    const deleteById =  (id : number) => {
        return handleFetch( async()=>{
            const response = await apiClient.delete(`/products/${id}`);
            return response.data;
        })
    }

    type ProductsListFilters = {
        per_page?: number;
        page?: number;
        name?: string;
    }

    /**  Retreive products with pagination */
    const list = (url : string|null = null, filters: ProductsListFilters = {}) => {
        const finalUrl = url ? url : '/products';
        return handleFetch(async () => {
            const response = await apiClient.get<
            ApiResponse<LaravelPaginator<Product>>
            >(finalUrl, { params: filters })
            return response.data
        });
    }

    /** Retreive products based on query string */
    const searchProducts = (query : string) => {

        return handleFetch(async () => {
            const response = await apiClient.get<
            ApiResponse<{data : Product[]}>
            >("/search/products", { params: {query : query} })
            return response.data
        });
    }
    

    return { create, loading, list, searchProducts, deleteById }
}

export class QuotationDTO {

    // private quotation : QuotationType;
    private products : ProductForm[];
    public baseAmount : number;
    public subTotal : number;
    public discountAmount : number;
    public taxAmount : number;
    public total : number;

    constructor(products : ProductForm[]){
        this.products = products;
        this.calculateTotals();
    }

    /* For a product */
    applyDiscount (baseAmount : number, discountPercentage : number){
        return baseAmount * ( 1 - (discountPercentage / 100));
    }
    /* For a product */
    applyTax(subTotal : number, taxPercentage : number){
        return subTotal * ( 1 + (taxPercentage / 100));
    }
    /* Calculate total Discount, Total Tax, and Final Total. Sub Total, baseAmount */
    calculateProductTotal (prod : ProductForm){

        const baseAmount = prod.quantity * prod.unit_price;
        let subTotal = baseAmount;
        if(prod.discount_percentage && prod.discount_percentage > 0) {
        subTotal = this.applyDiscount(prod.quantity * prod.unit_price, prod.discount_percentage);
        }
        const discountAmount = baseAmount - subTotal;
        let total = subTotal;
        if(prod.tax_percentage && prod.tax_percentage > 0) {
            total = this.applyTax(subTotal, prod.tax_percentage );
        }
        const taxAmount = total - subTotal; 

        return {
            discountAmount : discountAmount,
            taxAmount : taxAmount, 
            subTotal : subTotal, 
            baseAmount : baseAmount,
            total : total
        };
    }

    public calculateTotals() : void {
        let total = 0;
        let subTotal = 0;
        let taxAmount = 0;
        let baseAmount = 0;
        let discountAmount =0;

        this.products.map((prod)=>{
            if(!prod.quantity || !prod.unit_price) return;
            const totals = this.calculateProductTotal(prod);
            total+=totals.total;
            subTotal+=totals.subTotal;
            taxAmount+=totals.taxAmount;
            baseAmount+=totals.baseAmount;
            discountAmount+=totals.discountAmount;
        });

        this.total = total;
        this.baseAmount = baseAmount;
        this.discountAmount = discountAmount;
        this.subTotal = subTotal;
        this.taxAmount = taxAmount;
    }

}