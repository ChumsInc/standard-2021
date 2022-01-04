import {buildImage} from "./chums-theme--images";
import {compile} from 'handlebars';
import {formatMoney} from "@shopify/theme-currency";
import {CartItem, Cart, DiscountAllocation, ItemDiscountAllocation} from '@shopify/theme-cart';

interface ItemDiscount extends ItemDiscountAllocation{
    formattedAmount: string,
}
interface CartDiscount extends DiscountAllocation{
    formattedAmount: string,
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
const template = compile(source);

const missingImage = '//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif';

function setLoading(state:boolean) {
    status.loading = state;
    elements.container.classList.toggle('is-loading', state);
}

function emptyCart() {
    elements.container.innerText = '';
}

function buildCartInner(cart:Cart):HTMLElement {
    const items = cart.items.map(item => {
        const {key, url, title, variant_title, properties, quantity, price, vendor, total_discount, image, line_level_discount_allocations} = item;

        const productImage = !!image ? image.replace(/(\.[^.]*)$/, "_180x$1") : missingImage;
        Object.keys(properties).forEach(key => {
            if (key.charAt(0) === '_' || !properties[key]) {
                delete properties[key];
            }
        });

        const discounts:ItemDiscount[] = line_level_discount_allocations.map((discount) => {
            return {
                ...discount,
                formattedAmount: formatMoney(discount.amount, theme.settings.moneyFormat)
            }
        })

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
            discounts,
            discountsApplied: !!discounts.length,
            vendor,
        }
    });

    const cartDiscounts =  cart.cart_level_discount_applications.map(discount => {
        return {
            ...discount,
            formattedAmount: formatMoney(discount.total_allocated_amount, theme.settings.moneyFormat)
        }
    })

    const templateData = {
        items,
        note: cart.note,
        cartDiscounts: cartDiscounts,
        cartDiscountsApplied: !!cartDiscounts.length,
        totalPrice: formatMoney(cart.total_price, theme.settings.moneyFormat),
    }

    const html:string = template(templateData);
    const div = document.createElement('div');
    div.innerHTML = html;
    return div;
}


function buildCart(cart:Cart, openDrawer?:boolean) {
    setLoading(true);
    if (cart.items.length === 0) {
        const p = document.createElement('p');
        p.innerText = window.theme?.strings?.cartEmpty;
        elements.container.appendChild(p);
    } else {
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
        setTimeout(() => sizeFooter(),800);
    }

    if (openDrawer) {
        //@todo implement cartDrawer modal
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
