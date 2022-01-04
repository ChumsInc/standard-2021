declare module '@shopify/theme-cart' {
    export interface FeaturedImage {
        alt: string,
        aspect_ratio: number,
        height: number,
        url: string,
        width: number
    }

    export interface DiscountAllocation {
        type: string,
        key: string,
        title: string,
        description: string|null,
        value: string,
        created_at: string,
        value_type: string,
        allocation_method: string,
        target_selection: string,
        target_type: string,
        total_allocated_amount: number,
    }

    export interface ItemDiscountAllocation {
        amount: number,
        discount_application: DiscountAllocation
    }

    export interface VariantOption {
        name: string,
        value: string,
    }
    export interface CartItem {
        id: number,
        properties:null|object,
        quantity:number,
        variant_id: number,
        key:string,
        title: string,
        price: number,
        original_price: number,
        discounted_price: number,
        line_price: number,
        original_line_price: number,
        total_discount: number,
        discounts: object[],
        sku: string,
        grams: number,
        vendor: string,
        taxable: boolean,
        product_id: number,
        product_has_only_default_variant: boolean,
        gift_card: boolean,
        final_price: number,
        final_line_price: number,
        url: string,
        featured_image: FeaturedImage,
        image:string,
        handle: string,
        requires_shipping: boolean,
        product_type: string,
        product_title: string,
        product_description: string,
        variant_title: string,
        variant_options: string[],
        options_with_values: VariantOption[],
        line_level_discount_allocations: ItemDiscountAllocation[],
        line_level_total_discount: number,
    }

    export interface Cart {
        token: string,
        note: null|string,
        attributes: object,
        original_total_price: number,
        total_price: number,
        total_discount: number,
        total_weight: number,
        item_count: number,
        items: CartItem[],
        requires_shipping: boolean,
        currency: string,
        items_subtotal_price: number,
        cart_level_discount_applications: DiscountAllocation[]
    }

    export interface CartOption {
        quantity?: number,
        properties?: object
    }

    export interface ShippingRate {
        name: string,
        price: string,
        delivery_date: string|null,
        source: string,
    }


    export function getState(): Promise<Cart>;
    export function getItemIndex(key:string): Promise<number>;
    export function getItem(key:string): Promise<CartItem>;
    export function addItem(id:number, options): Promise<CartItem>;
    export function addItemFromForm(form:HTMLFormElement):Promise<CartItem>;
    export function updateItem(key:string, options:CartOption): Promise<Cart>;
    export function removeItem(key:string): Promise<Cart>;
    export function clearItems(): Promise<Cart>;
    export function getAttributes(): Promise<object>;
    export function updateAttributes(attributes:object): Promise<Cart>;
    export function clearAttributes(): Promise<Cart>;
    export function getNote(): Promise<string>
    export function updateNote(): Promise<Cart>;
    export function clearNote(): Promise<Cart>;
    export function getShippingRates(): Promise<ShippingRate[]>
}
