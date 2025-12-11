interface Product {
    id : string,
    name : string,
    description : string,
    unit_of_measurement : string,
    quantity : number,
    discount_percentage : number,
    unit_price : number,
    net_unit_price : number,
    final_price : number,
    tax_percentage : number
}

type ProductsForm = Partial<Product>;
export type {Product, ProductsForm};