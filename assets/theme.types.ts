export interface FeaturedImage {
    alt: string
    aspect_ratio: number,
    height: number,
    url: string
    width: number
}

export interface ProductSearchResult {
    available: boolean,
    body: string
    compare_at_price_max: string,
    compare_at_price_min: string,
    handle: string,
    id: number,
    image: string
    price: string,
    price_max: string,
    price_min: string,
    tags: string[],
    title: string,
    type: string,
    url: string,
    variants: [],
    vendor: string,
    featured_image: FeaturedImage,
}

export interface SiteSearchState {
    results: ProductSearchResult[],
    loading: boolean,
    timer: number|null,
    lastSearch: string,
}
