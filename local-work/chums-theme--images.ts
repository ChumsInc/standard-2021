import {FeaturedImage} from "./types";
import classNames from "classnames";

interface ImageOptions {
    lazy?: boolean,
    width?: number,
    className?:string|object,
}

export function buildImage(image:FeaturedImage|string, options?:ImageOptions):HTMLImageElement {
    const img = document.createElement('img');

    if (typeof image === 'string') {
        img.src = getSizedImageUrl(image, options?.width);
    } else {
        if (!image.url) {
            return img;
        }
        img.src = getSizedImageUrl(image.url, options?.width);
        img.width = options?.width ?? image.width;
        img.height = options?.width ? options.width / image.aspect_ratio : image.height;
    }
    if (options?.width) {
        const _2x = getSizedImageUrl(img.src, options.width * 2);
        img.srcset = `${img.src}, ${_2x} 2x`;
    }

    img.className = classNames(options?.className);
    if (options?.lazy) {
        img.loading = 'lazy';
    }
    return img;
}


/**
 * Find the Shopify image attribute size
 *
 * @param {string} src
 * @returns {null}
 */
function imageSize(src:string):string|null {
    if (!src) {
        return '620x'; // default based on theme
    }

    const match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match !== null) {
        return match[1];
    } else {
        return null;
    }
}

/**
 * Adds a Shopify size attribute to a URL
 *
 * @param src
 * @param size
 * @returns {*}
 */
function getSizedImageUrl(src:string, size?:string|number|null):string|null {
    if (size == null) {
        return src;
    }

    if (size === 'master') {
        return removeProtocol(src);
    }
    if (typeof size === 'number') {
        size = String(size) + 'x';
    }

    const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match != null) {
        const prefix = src.split(match[0]);
        const suffix = match[0];

        return removeProtocol(prefix[0] + '_' + size + suffix);
    }

    return null;
}

function removeProtocol(path:string):string {
    return path.replace(/http(s)?:/, '');
}
