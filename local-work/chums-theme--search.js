"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayResults = exports.searchResponse = exports.searchElements = void 0;
var chums_theme__images_1 = require("./chums-theme--images");
var lodash_1 = require("lodash");
function searchURL(search) {
    var params = new URLSearchParams();
    params.append('s', search);
    params.append('resources[type]', 'product,collection,page,article');
    params.append('resources[limit]', '10');
    params.append('resources[options][unavailable_products]', 'last');
    return '/search/suggest.json?' + params.toString();
}
var searchDelay = 500;
exports.searchElements = {
    form: document.querySelector('#site-header__search-form'),
    input: document.querySelector('#site-header__search-form input[type="search"]'),
    results: document.querySelector('#site-header__search_results'),
    resultsCount: document.querySelector('#site-header__search_results .site-header__search-results-count'),
    resultsList: document.querySelector('#site-header__search_results .site-header__search-results-list'),
    loadingSpinner: document.querySelector('#site-header__search_results .site-header__search-results--loading'),
};
exports.searchResponse = {
    search: '',
    results: {},
    elements: []
};
function showSearchLoading(isLoading) {
    if (isLoading === void 0) { isLoading = false; }
    exports.searchElements.loadingSpinner.classList.toggle('show', isLoading);
    exports.searchElements.resultsList.setAttribute('aria-busy', isLoading ? 'true' : 'false');
}
function toggleDropDown(state) {
    exports.searchElements.results.classList.toggle('show', state !== null && state !== void 0 ? state : undefined);
}
function fetchSearchResults(search) {
    try {
        toggleDropDown(true);
        showSearchLoading(true);
        exports.searchResponse.search = search;
        var url = searchURL(search);
        fetch(url, { credentials: 'same-origin', cache: 'no-cache' })
            .then(function (res) { return res.json(); })
            .then(function (res) {
            exports.searchResponse.results = res.resources.results;
            displayResults(res.resources.results);
            showSearchLoading(false);
        });
    }
    catch (err) {
        console.log("SiteSearch.fetchSearch()", err.message);
    }
}
function handleSearchKeydown(ev) {
    console.log(ev.key, ev.code);
    if (ev.isComposing || ev.keyCode === 229) {
        return;
    }
    var value = exports.searchElements.input.value;
    if (exports.searchElements.resultsList.classList.contains('has-results') && exports.searchResponse.search === value) {
        return;
    }
    if (value.trim().length === 0) {
        toggleDropDown(false);
        return;
    }
    fetchSearchResults(value);
}
function displayResults(results) {
    if (results === void 0) { results = {}; }
    exports.searchElements.resultsList.innerText = '';
    exports.searchElements.resultsList.classList.toggle('has-results', true);
    displayProducts(results.products || []);
    displayCollections(results.collections || []);
    displayArticles(results.articles || []);
    displayPages(results.pages || []);
    buildSectionTitle('Dig Deeper');
    var link = document.createElement('a');
    link.href = '#';
    link.innerText = "Search entire site for '" + exports.searchElements.input.value.trim() + "'";
    link.addEventListener('click', function (ev) {
        ev.preventDefault();
        exports.searchElements.form.submit();
    });
    exports.searchElements.resultsList.appendChild(link);
}
exports.displayResults = displayResults;
function buildSectionTitle(title) {
    var li = document.createElement('li');
    li.className = 'search-result__section-title';
    li.innerText = title;
    exports.searchElements.resultsList.appendChild(li);
}
function buildSearchResultImage(_a, describedBy) {
    var featured_image = _a.featured_image, image = _a.image, id = _a.id, title = _a.title;
    var imgContainer = document.createElement('div');
    imgContainer.className = 'search-result__image';
    var img = chums_theme__images_1.buildImage(featured_image || image, { width: 80, className: 'img-fluid' });
    if (!!describedBy) {
        img.setAttribute('aria-describedby', describedBy);
    }
    imgContainer.appendChild(img);
    return imgContainer;
}
function buildProductImage(product) {
    return buildSearchResultImage(product, "product-" + product.id + "-title'");
}
function buildProductPrice(product) {
    var min = product.price_min;
    var max = product.price_max;
    var caMin = product.compare_at_price_min;
    var caMax = product.compare_at_price_max;
    var price = product.price;
    var hasSale = min < caMin || max < caMax;
    var hasPriceRange = caMin < caMax;
    var priceContainer = document.createElement('div');
    priceContainer.classList.toggle('search-result__detail-price', true);
    var priceEl = document.createElement('span');
    priceEl.innerText = hasPriceRange ? 'From:' : 'Price:';
    priceContainer.appendChild(priceEl);
    var priceVal = document.createElement('span');
    priceVal.classList.toggle('price--on-sale', hasSale);
    if (hasPriceRange) {
        priceVal.innerText = '$ ' + caMin;
    }
    else {
        priceVal.innerText = '$ ' + (caMin || price);
    }
    priceContainer.appendChild(priceVal);
    if (hasSale) {
        var salePrice = document.createElement('span');
        salePrice.classList.toggle('price--sale-price');
        if (hasPriceRange) {
            salePrice.innerText = '$ ' + caMin;
        }
        else {
            salePrice.innerText = '$ ' + price;
        }
        priceContainer.appendChild(salePrice);
    }
    return priceContainer;
}
function buildProductTitle(product) {
    var infoContainer = document.createElement('div');
    infoContainer.className = 'search-result__detail';
    var title = document.createElement('div');
    title.className = 'search-result__detail-title';
    title.innerText = product.title;
    title.id = 'product-' + product.id + '-title';
    infoContainer.appendChild(title);
    infoContainer.appendChild(buildProductPrice(product));
    return infoContainer;
}
function buildProductResult(product) {
    var a = document.createElement('a');
    a.href = product.url;
    a.setAttribute('aria-describedby', 'product-' + product.id + '-title');
    var div = document.createElement('div');
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
    products.forEach(function (product) {
        var li = document.createElement('li');
        li.className = 'search-result__item';
        li.appendChild(buildProductResult(product));
        exports.searchElements.resultsList.appendChild(li);
        exports.searchResponse.elements.push(li);
    });
}
function buildSearchResult(result, linkPrefix, child) {
    var linkId = linkPrefix + "-" + result.id + "-title";
    var a = document.createElement('a');
    a.setAttribute('aria-describedby', linkId);
    a.href = result.url;
    a.className = 'search-link';
    var searchResult = document.createElement('div');
    searchResult.className = 'search-result';
    if (result.featured_image || !!result.image) {
        searchResult.appendChild(buildSearchResultImage(result, linkId));
    }
    var detail = document.createElement('div');
    detail.className = 'search-result__detail';
    var title = document.createElement('div');
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
    collections.forEach(function (collection) {
        var li = document.createElement('li');
        li.className = 'search-result__item search-result__collection-title';
        li.appendChild(buildSearchResult(collection, 'collection'));
        exports.searchElements.resultsList.appendChild(li);
        exports.searchResponse.elements.push(li);
    });
}
function displayArticles(articles) {
    if (articles.length) {
        buildSectionTitle('Articles');
    }
    articles.forEach(function (article) {
        var li = document.createElement('li');
        li.className = 'search-result__item search-result__article';
        var date = new Date(article.published_at);
        var published = document.createElement('div');
        published.innerText = date.toLocaleDateString();
        published.className = 'search-result__article-date';
        li.appendChild(buildSearchResult(article, 'article', published));
        exports.searchElements.resultsList.appendChild(li);
        exports.searchResponse.elements.push(li);
    });
}
function displayPages(pages) {
    if (pages.length) {
        buildSectionTitle('Pages');
    }
    pages.forEach(function (page) {
        var li = document.createElement('li');
        li.className = 'search-result__item search-result__page';
        li.appendChild(buildSearchResult(page, 'page'));
        exports.searchElements.resultsList.appendChild(li);
        exports.searchResponse.elements.push(li);
    });
}
exports.searchElements.input.addEventListener('keydown', lodash_1.debounce(handleSearchKeydown, 350));
//# sourceMappingURL=chums-theme--search.js.map