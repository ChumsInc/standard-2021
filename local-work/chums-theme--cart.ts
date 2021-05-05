import {Cart, CartItem, SearchResult} from "./types";
import {buildImage} from "./chums-theme--images";
import {compile} from 'handlebars';
import {formatMoney} from "./chums-theme--currency";

interface KeyedObject {
    [key:string]: any
}
declare global {
    interface Window {
        theme: {
            settings: KeyedObject,
            strings: KeyedObject
        },
        Shopify: any,
    }
}

const theme = window.theme;

const config = {
    namespace: '.ajaxcart',
}

const selectors = {
    drawer: '#CartDrawer',
    container: '#CartContainer',
    template: '#CartTemplate',
    fixedFooter: '.drawer__footer--fixed',
    fixedInnerContent: '.drawer__inner--has-fixed-footer',
    cartBubble: '.cart-link__bubble'
};

const elements = {
    drawer: document.querySelector(selectors.drawer),
    container: document.querySelector(selectors.container) as HTMLElement,
    fixedFooter: document.querySelector(selectors.fixedFooter),
    fixedInnerContent: document.querySelector(selectors.fixedInnerContent),
    cartBubble: document.querySelector(selectors.cartBubble),
}

interface CartStatus {
    loaded: boolean,
    loading: boolean,
}

const status:CartStatus = {
    loaded: false,
    loading: false
}

const source = document.querySelector(selectors.template).innerHTML;
const template = Handlebars.compile(source);

const missingImage = '//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif';

function setLoading(state:boolean) {
    status.loading = state;
    elements.container.classList.toggle('is-loading', state);
}

function emptyCart() {
    elements.container.innerText = '';
}

function buildCartInner(cart:Cart) {
    const items = cart.items.map(item => {
        const {key, url, title, variant_title, properties, quantity, price, vendor, total_discount, image, line_level_discount_allocations} = item;

        const productImage = !!image ? image.replace(/(\.[^.]*)$/, "_180x$1") : missingImage;
        Object.keys(properties).forEach(key => {
            if (key.charAt(0) === '_' || !properties[key]) {
                delete properties[key];
            }
        });

        let amount = 0;
        if (line_level_discount_allocations.length) {
            line_level_discount_allocations.forEach(disc => {
                disc.formattedAmount = formatMoney(disc.amount, theme.settings.moneyFormat);
            })
        }

        return {
            key,
            url,
            img: productImage,
            name: title,
            variation: variant_title,
            properties,
            itemQty: quantity,
            price: formatMoney(price, theme.settings.moneyFormat),
            discountedPrice: formatMoney(price - (total_discount / quantity), theme.settings.moneyFormat),
            discounts: line_level_discount_allocations,
            discountsApplied: !!line_level_discount_allocations.length,
            vendor,
        }
    })
    // @todo - Finish Implenting CartDrawer
}


function buildCart(cart:Cart) {
    setLoading(true);
    if (cart.items.length === 0) {
        const p = document.createElement('p');
        p.innerText = window.theme?.strings?.cartEmpty;
    } else {

    }
    status.loaded = true;
    setLoading(false);

    // if (window.theme.settings.currenciesEnabled) {
    //     window.theme.currencySwitcher.ajaxrefresh();
    // }

    if (window.Shopify && window.Shopify.StorefrontExpressButtons) {
        window.Shopify.StorefrontExpressButtons.initialize();

        // Resize footer after arbitrary delay for buttons to load
        setTimeout(() => sizeFooter(),800);
    }
}

function sizeFooter() {
    if (!elements.drawer.classList.contains('drawer--has-fixed-footer')) {
        return;
    }
    const cartFooter = elements.drawer.querySelector(selectors.fixedFooter) as HTMLElement;
    cartFooter.removeAttribute('style');

    const cartInner = elements.drawer.querySelector(selectors.fixedInnerContent) as HTMLElement;
    cartInner.removeAttribute('style');

    const cartFooterHeight = cartFooter.offsetHeight;
    cartInner.style.bottom = cartFooterHeight + 'px';
    cartFooter.style.height = cartFooterHeight + 'px';
}

const cartItemId = (id:number) => `cart-item--${id}`;

function buildCartItemImage({featured_image, image, id, url}:CartItem, describedBy?: string):HTMLElement {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'cart-item__image';

    const a = document.createElement('a');
    a.href = url;

    const img = buildImage(featured_image || image, {width: 180, className: 'img-fluid'});
    if (!!describedBy) {
        img.setAttribute('aria-describedby', cartItemId(id));
    }

    a.appendChild(img)

    imgContainer.appendChild(a);
    return imgContainer;
}


function buildCartQty({key, quantity}:CartItem):HTMLElement {
    const el = document.createElement('div');
    el.className = 'cart-item__quantity';

    const label = document.createElement('label');
    label.className = 'visually-hidden';
    label.innerText = 'Quantity';
    el.appendChild(label)

    const wrapper = document.createElement('div');
    wrapper.className = 'cart-item__input-wrapper form-group form-group-sm';
    const decButton = document.createElement('button');
    decButton.className = 'btn btn-outline-secondary cart-item__adjust--minus';
    decButton.innerText = '-'
    // decButton.setAttribute('')
    return el;
}

function buildCartItem(item:CartItem) {
    const div = document.createElement('div');
    div.className = 'cart-item__details';
    const titleEl = document.createElement('div');
    div.className = 'cart-item__title';
    div.innerText = item.title;



}
