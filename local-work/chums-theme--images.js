"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildImage = void 0;
var classnames_1 = require("classnames");
function buildImage(image, options) {
    var _a;
    var img = document.createElement('img');
    if (typeof image === 'string') {
        img.src = getSizedImageUrl(image, options === null || options === void 0 ? void 0 : options.width);
    }
    else {
        if (!image.url) {
            return img;
        }
        img.src = getSizedImageUrl(image.url, options === null || options === void 0 ? void 0 : options.width);
        img.width = (_a = options === null || options === void 0 ? void 0 : options.width) !== null && _a !== void 0 ? _a : image.width;
        img.height = (options === null || options === void 0 ? void 0 : options.width) ? options.width / image.aspect_ratio : image.height;
    }
    if (options === null || options === void 0 ? void 0 : options.width) {
        var _2x = getSizedImageUrl(img.src, options.width * 2);
        img.srcset = img.src + ", " + _2x + " 2x";
    }
    img.className = (0, classnames_1.default)(options === null || options === void 0 ? void 0 : options.className);
    if (options === null || options === void 0 ? void 0 : options.lazy) {
        img.loading = 'lazy';
    }
    return img;
}
exports.buildImage = buildImage;
/**
 * Find the Shopify image attribute size
 *
 * @param {string} src
 * @returns {null}
 */
function imageSize(src) {
    if (!src) {
        return '620x'; // default based on theme
    }
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
    if (match !== null) {
        return match[1];
    }
    else {
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
function getSizedImageUrl(src, size) {
    if (size == null) {
        return src;
    }
    if (size === 'master') {
        return removeProtocol(src);
    }
    if (typeof size === 'number') {
        size = String(size) + 'x';
    }
    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
    if (match != null) {
        var prefix = src.split(match[0]);
        var suffix = match[0];
        return removeProtocol(prefix[0] + '_' + size + suffix);
    }
    return null;
}
function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
}
//# sourceMappingURL=chums-theme--images.js.map