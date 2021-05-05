import {SearchProduct, SearchResult, SearchResults} from "./types";
import {buildImage} from "./chums-theme--images";
import {debounce} from 'lodash'

export interface SearchResponse {
    search: string,
    results: SearchResults,
    elements: HTMLLIElement[]
}

function searchURL(search:string):string {
    const params = new URLSearchParams();
    params.append('s', search);
    params.append('resources[type]', 'product,collection,page,article');
    params.append('resources[limit]', '10');
    params.append('resources[options][unavailable_products]', 'last');
    return '/search/suggest.json?' + params.toString();
}

const searchDelay = 500;
export const searchElements = {
    form: document.querySelector('#site-header__search-form') as HTMLFormElement,
    input: document.querySelector('#site-header__search-form input[type="search"]') as HTMLInputElement,
    results: document.querySelector('#site-header__search_results'),
    resultsCount: document.querySelector('#site-header__search_results .site-header__search-results-count'),
    resultsList: document.querySelector('#site-header__search_results .site-header__search-results-list') as HTMLElement,
    loadingSpinner: document.querySelector('#site-header__search_results .site-header__search-results--loading'),
}
export const searchResponse:SearchResponse = {
    search: '',
    results: {},
    elements: []
}

function showSearchLoading(isLoading:boolean = false) {
    searchElements.loadingSpinner.classList.toggle('show', isLoading);
    searchElements.resultsList.setAttribute('aria-busy', isLoading ? 'true' : 'false');
}

function toggleDropDown(state?:boolean) {
    searchElements.results.classList.toggle('show', state ?? undefined);
}
function fetchSearchResults(search) {
    try {
        toggleDropDown(true);
        showSearchLoading(true);
        searchResponse.search = search;
        const url = searchURL(search);
        fetch(url, {credentials: 'same-origin', cache: 'no-cache'})
            .then(res => res.json())
            .then(res => {
                searchResponse.results = res.resources.results;
                displayResults(res.resources.results);
                showSearchLoading(false);
            });

    } catch(err) {
        console.log("SiteSearch.fetchSearch()", err.message);
    }
}

function handleSearchKeydown(ev:KeyboardEvent) {
    console.log(ev.key, ev.code);
    if (ev.isComposing || ev.keyCode === 229) {
        return;
    }

    const value = searchElements.input.value;
    if (searchElements.resultsList.classList.contains('has-results') && searchResponse.search === value) {
        return;
    }
    if (value.trim().length === 0) {
        toggleDropDown(false);
        return;
    }
    fetchSearchResults(value);
}

export function displayResults(results:SearchResults = {}) {
    searchElements.resultsList.innerText = '';
    searchElements.resultsList.classList.toggle('has-results', true);
    displayProducts(results.products || []);
    displayCollections(results.collections || []);
    displayArticles(results.articles || []);
    displayPages(results.pages || []);
    buildSectionTitle('Dig Deeper');
    const link = document.createElement('a');
    link.href = '#';
    link.innerText = "Search entire site for '" + searchElements.input.value.trim() + "'";
    link.addEventListener('click', (ev) => {
        ev.preventDefault();
        searchElements.form.submit();
    })
    searchElements.resultsList.appendChild(link);
}

function buildSectionTitle(title) {
    const li = document.createElement('li');
    li.className = 'search-result__section-title';
    li.innerText = title;
    searchElements.resultsList.appendChild(li);

}

function buildSearchResultImage({featured_image, image, id, title}:SearchResult, describedBy?: string):HTMLElement {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'search-result__image';
    const img = buildImage(featured_image || image, {width: 80, className: 'img-fluid'});
    if (!!describedBy) {
        img.setAttribute('aria-describedby', describedBy);
    }
    imgContainer.appendChild(img);
    return imgContainer;
}

function buildProductImage(product):HTMLElement {
    return buildSearchResultImage(product, `product-${product.id}-title'`);
}

function buildProductPrice(product:SearchProduct):HTMLElement {
    const min = product.price_min;
    const max = product.price_max;
    const caMin = product.compare_at_price_min;
    const caMax = product.compare_at_price_max;
    const price = product.price;
    const hasSale = min < caMin || max < caMax;
    const hasPriceRange = caMin < caMax;

    const priceContainer = document.createElement('div');
    priceContainer.classList.toggle('search-result__detail-price', true);

    const priceEl = document.createElement('span');
    priceEl.innerText = hasPriceRange ? 'From:' : 'Price:';
    priceContainer.appendChild(priceEl);

    const priceVal = document.createElement('span');
    priceVal.classList.toggle('price--on-sale', hasSale);
    if (hasPriceRange) {
        priceVal.innerText = '$ ' + caMin;
    } else {
        priceVal.innerText = '$ ' + (caMin || price);
    }
    priceContainer.appendChild(priceVal);

    if (hasSale) {
        const salePrice = document.createElement('span');
        salePrice.classList.toggle('price--sale-price');
        if (hasPriceRange) {
            salePrice.innerText = '$ ' + caMin;
        } else {
            salePrice.innerText = '$ ' + price;
        }
        priceContainer.appendChild(salePrice)
    }
    return priceContainer;
}

function buildProductTitle(product:SearchProduct):HTMLElement {
    const infoContainer = document.createElement('div');
    infoContainer.className = 'search-result__detail';
    const title = document.createElement('div');
    title.className = 'search-result__detail-title';
    title.innerText = product.title;
    title.id = 'product-' + product.id + '-title';
    infoContainer.appendChild(title);
    infoContainer.appendChild(buildProductPrice(product));
    return infoContainer;
}

function buildProductResult(product) {
    const a = document.createElement('a');
    a.href = product.url;
    a.setAttribute('aria-describedby', 'product-' + product.id + '-title');
    const div = document.createElement('div');
    div.className = 'search-result';
    div.appendChild(buildProductImage(product));
    div.appendChild(buildProductTitle(product));
    a.appendChild(div);
    return a;
}

function displayProducts(products) {
    if (products.length) {
        buildSectionTitle('Products');
    }
    products.forEach(product => {
        const li = document.createElement('li');
        li.className = 'search-result__item';
        li.appendChild(buildProductResult(product));
        searchElements.resultsList.appendChild(li);
        searchResponse.elements.push(li);
    })
}

function buildSearchResult(result:SearchResult, linkPrefix:string, child?:ChildNode|DocumentFragment) {
    const linkId = `${linkPrefix}-${result.id}-title`;
    const a = document.createElement('a');
    a.setAttribute('aria-describedby', linkId);
    a.href = result.url;
    a.className = 'search-link';

    const searchResult = document.createElement('div');
    searchResult.className = 'search-result';
    if (result.featured_image || !!result.image) {
        searchResult.appendChild(buildSearchResultImage(result, linkId));
    }

    const detail = document.createElement('div');

    detail.className = 'search-result__detail';
    const title = document.createElement('div');
    title.innerText = result.title;
    title.className = 'search-result__detail-title';
    detail.appendChild(title);

    if (child) {
        detail.appendChild(child);
    }
    searchResult.appendChild(detail);
    a.appendChild(searchResult);
    return a;
}

function displayCollections(collections) {
    if (collections.length) {
        buildSectionTitle('Collections');
    }
    collections.forEach(collection => {
        const li = document.createElement('li');
        li.className = 'search-result__item search-result__collection-title';
        li.appendChild(buildSearchResult(collection, 'collection'))
        searchElements.resultsList.appendChild(li);
        searchResponse.elements.push(li);
    })
}

function displayArticles(articles) {
    if (articles.length) {
        buildSectionTitle('Articles');
    }
    articles.forEach(article => {
        const li = document.createElement('li');
        li.className = 'search-result__item search-result__article';
        const date = new Date(article.published_at);
        const published = document.createElement('div');
        published.innerText = date.toLocaleDateString();
        published.className = 'search-result__article-date';

        li.appendChild(buildSearchResult(article, 'article', published));
        searchElements.resultsList.appendChild(li);
        searchResponse.elements.push(li);
    });
}

function displayPages(pages) {
    if (pages.length) {
        buildSectionTitle('Pages');
    }
    pages.forEach(page => {
        const li = document.createElement('li');
        li.className = 'search-result__item search-result__page';
        li.appendChild(buildSearchResult(page, 'page'));
        searchElements.resultsList.appendChild(li);
        searchResponse.elements.push(li);
    });
}


searchElements.input.addEventListener('keydown', debounce(handleSearchKeydown, 350));
