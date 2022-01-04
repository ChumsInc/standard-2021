"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var handlebars_1 = require("handlebars");
var theme_currency_1 = require("@shopify/theme-currency");
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
var template = (0, handlebars_1.compile)(source);
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
        var discounts = line_level_discount_allocations.map(function (discount) {
            return __assign(__assign({}, discount), { formattedAmount: (0, theme_currency_1.formatMoney)(discount.amount, theme.settings.moneyFormat) });
        });
        return {
            key: key,
            url: url,
            img: productImage,
            name: title,
            variation: variant_title,
            properties: properties,
            itemQty: quantity,
            price: (0, theme_currency_1.formatMoney)(price, theme.settings.moneyFormat),
            discountedPrice: (0, theme_currency_1.formatMoney)(price - (total_discount / quantity), theme.settings.moneyFormat),
            discounts: discounts,
            discountsApplied: !!discounts.length,
            vendor: vendor,
        };
    });
    var cartDiscounts = cart.cart_level_discount_applications.map(function (discount) {
        return __assign(__assign({}, discount), { formattedAmount: (0, theme_currency_1.formatMoney)(discount.total_allocated_amount, theme.settings.moneyFormat) });
    });
    var templateData = {
        items: items,
        note: cart.note,
        cartDiscounts: cartDiscounts,
        cartDiscountsApplied: !!cartDiscounts.length,
        totalPrice: (0, theme_currency_1.formatMoney)(cart.total_price, theme.settings.moneyFormat),
    };
    var html = template(templateData);
    var div = document.createElement('div');
    div.innerHTML = html;
    return div;
}
function buildCart(cart, openDrawer) {
    var _a, _b;
    setLoading(true);
    if (cart.items.length === 0) {
        var p = document.createElement('p');
        p.innerText = (_b = (_a = window.theme) === null || _a === void 0 ? void 0 : _a.strings) === null || _b === void 0 ? void 0 : _b.cartEmpty;
        elements.container.appendChild(p);
    }
    else {
        elements.container.appendChild(buildCartInner(cart));
    }
    status.loaded = true;
    setLoading(false);
    // @TODO: add script for theme.settings.currenciesEnabled
    // if (window.theme.settings.currenciesEnabled) {
    //     window.theme.currencySwitcher.ajaxrefresh();
    // }
    if (window.Shopify && window.Shopify.StorefrontExpressButtons) {
        window.Shopify.StorefrontExpressButtons.initialize();
        // Resize footer after arbitrary delay for buttons to load
        setTimeout(function () { return sizeFooter(); }, 800);
    }
    if (openDrawer) {
        //@todo implement cartDrawer modal
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
//# sourceMappingURL=chums-theme--cart.js.map