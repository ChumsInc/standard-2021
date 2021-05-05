export interface SearchResult {
    featured_image?: FeaturedImage,
    image?: string,
    url: string,
    title: string,
    id: number,
}

export interface FeaturedImage {
    alt: string,
    aspect_ratio: number,
    height: number,
    url: string,
    width: number
}

export interface SearchArticle extends SearchResult{
    author: string,
    published_at: string,
}

export interface SearchCollection extends SearchResult {}

export interface SearchPage extends SearchResult {}

export interface SearchProduct extends SearchResult {
    available: boolean,
    price: string,
    price_min?: string,
    price_max?: string,
    compare_at_price_min?: string,
    compare_at_price_max?: string,
}

export interface SearchResults {
    articles?: SearchArticle[],
    collections?: SearchCollection[],
    pages?: SearchPage[],
    products?: SearchProduct[]
}

export interface DiscountAllocation {
    amount: number;
    formattedAmount?: string,
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
    product_id: number,
    final_price: number,
    final_line_price: number,
    featured_image: FeaturedImage,
    image:string,
    line_level_discount_allocations: DiscountAllocation[],
    line_level_total_discount: number,
    url:string,
    product_title: string,
    variant_title: string,
    variant_options: string[],
    options_with_values: VariantOption[],
    vendor: string,
}

export interface Cart {
    token: string,
    note: null|string,
    attributes: object,
    original_total_price: number,
    total_discount: number,
    total_weight: number,
    item_count: number,
    items: CartItem[],
    requires_shipping: boolean,
    currency: string,
    items_subtotal_price: number,
    cart_level_discount_applications: DiscountAllocation[]
}
