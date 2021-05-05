"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chums_theme__images_1 = require("./chums-theme--images");
var chums_theme__currency_1 = require("./chums-theme--currency");
var theme = window.theme;
var config = {
    namespace: '.ajaxcart',
};
var selectors = {
    drawer: '#CartDrawer',
    container: '#CartContainer',
    template: '#CartTemplate',
    fixedFooter: '.drawer__footer--fixed',
    fixedInnerContent: '.drawer__inner--has-fixed-footer',
    cartBubble: '.cart-link__bubble'
};
var elements = {
    drawer: document.querySelector(selectors.drawer),
    container: document.querySelector(selectors.container),
    fixedFooter: document.querySelector(selectors.fixedFooter),
    fixedInnerContent: document.querySelector(selectors.fixedInnerContent),
    cartBubble: document.querySelector(selectors.cartBubble),
};
var status = {
    loaded: false,
    loading: false
};
var source = document.querySelector(selectors.template).innerHTML;
var template = Handlebars.compile(source);
var missingImage = '//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif';
function setLoading(state) {
    status.loading = state;
    elements.container.classList.toggle('is-loading', state);
}
function emptyCart() {
    elements.container.innerText = '';
}
function buildCartInner(cart) {
    var items = cart.items.map(function (item) {
        var key = item.key, url = item.url, title = item.title, variant_title = item.variant_title, properties = item.properties, quantity = item.quantity, price = item.price, vendor = item.vendor, total_discount = item.total_discount, image = item.image, line_level_discount_allocations = item.line_level_discount_allocations;
        var productImage = !!image ? image.replace(/(\.[^.]*)$/, "_180x$1") : missingImage;
        Object.keys(properties).forEach(function (key) {
            if (key.charAt(0) === '_' || !properties[key]) {
                delete properties[key];
            }
        });
        var amount = 0;
        if (line_level_discount_allocations.length) {
            line_level_discount_allocations.forEach(function (disc) {
                disc.formattedAmount = chums_theme__currency_1.formatMoney(disc.amount, theme.settings.moneyFormat);
            });
        }
        return {
            key: key,
            url: url,
            img: productImage,
            name: title,
            variation: variant_title,
            properties: properties,
            itemQty: quantity,
            price: chums_theme__currency_1.formatMoney(price, theme.settings.moneyFormat),
            discountedPrice: chums_theme__currency_1.formatMoney(price - (total_discount / quantity), theme.settings.moneyFormat),
            discounts: line_level_discount_allocations,
            discountsApplied: !!line_level_discount_allocations.length,
            vendor: vendor,
        };
    });
    // @todo - Finish Implenting CartDrawer
}
function buildCart(cart) {
    var _a, _b;
    setLoading(true);
    if (cart.items.length === 0) {
        var p = document.createElement('p');
        p.innerText = (_b = (_a = window.theme) === null || _a === void 0 ? void 0 : _a.strings) === null || _b === void 0 ? void 0 : _b.cartEmpty;
    }
    else {
    }
    status.loaded = true;
    setLoading(false);
    // if (window.theme.settings.currenciesEnabled) {
    //     window.theme.currencySwitcher.ajaxrefresh();
    // }
    if (window.Shopify && window.Shopify.StorefrontExpressButtons) {
        window.Shopify.StorefrontExpressButtons.initialize();
        // Resize footer after arbitrary delay for buttons to load
        setTimeout(function () { return sizeFooter(); }, 800);
    }
}
function sizeFooter() {
    if (!elements.drawer.classList.contains('drawer--has-fixed-footer')) {
        return;
    }
    var cartFooter = elements.drawer.querySelector(selectors.fixedFooter);
    cartFooter.removeAttribute('style');
    var cartInner = elements.drawer.querySelector(selectors.fixedInnerContent);
    cartInner.removeAttribute('style');
    var cartFooterHeight = cartFooter.offsetHeight;
    cartInner.style.bottom = cartFooterHeight + 'px';
    cartFooter.style.height = cartFooterHeight + 'px';
}
var cartItemId = function (id) { return "cart-item--" + id; };
function buildCartItemImage(_a, describedBy) {
    var featured_image = _a.featured_image, image = _a.image, id = _a.id, url = _a.url;
    var imgContainer = document.createElement('div');
    imgContainer.className = 'cart-item__image';
    var a = document.createElement('a');
    a.href = url;
    var img = chums_theme__images_1.buildImage(featured_image || image, { width: 180, className: 'img-fluid' });
    if (!!describedBy) {
        img.setAttribute('aria-describedby', cartItemId(id));
    }
    a.appendChild(img);
    imgContainer.appendChild(a);
    return imgContainer;
}
function buildCartQty(_a) {
    var key = _a.key, quantity = _a.quantity;
    var el = document.createElement('div');
    el.className = 'cart-item__quantity';
    var label = document.createElement('label');
    label.className = 'visually-hidden';
    label.innerText = 'Quantity';
    el.appendChild(label);
    var wrapper = document.createElement('div');
    wrapper.className = 'cart-item__input-wrapper form-group form-group-sm';
    var decButton = document.createElement('button');
    decButton.className = 'btn btn-outline-secondary cart-item__adjust--minus';
    decButton.innerText = '-';
    // decButton.setAttribute('')
    return el;
}
function buildCartItem(item) {
    var div = document.createElement('div');
    div.className = 'cart-item__details';
    var titleEl = document.createElement('div');
    div.className = 'cart-item__title';
    div.innerText = item.title;
}
//# sourceMappingURL=chums-theme--cart.js.map