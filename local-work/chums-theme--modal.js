"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideModalBackdrop = exports.showModalBackdrop = void 0;
var modalSettings = {
    timer: 0,
    element: document.querySelector('#chums--modal-backdrop'),
    fadeDuration: 350,
};
function modalKeypressHandler(ev) {
    console.log(ev);
    if (ev.key === "Escape") {
        hideModalBackdrop();
    }
}
function showModalBackdrop(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.closeOnClick, closeOnClick = _c === void 0 ? true : _c, _d = _b.closeOnEscape, closeOnEscape = _d === void 0 ? true : _d;
    if (!modalSettings.element) {
        return;
    }
    clearTimeout(modalSettings.timer);
    modalSettings.element.className = 'modal-backdrop fade';
    modalSettings.timer = window.setTimeout(function () {
        modalSettings.element.classList.toggle('show', true);
    });
    if (closeOnClick) {
        modalSettings.element.addEventListener('click', hideModalBackdrop, { once: true });
    }
    if (closeOnEscape) {
        modalSettings.element.addEventListener('keyup', modalKeypressHandler);
    }
}
exports.showModalBackdrop = showModalBackdrop;
function hideModalBackdrop() {
    if (!modalSettings.element) {
        return;
    }
    modalSettings.element.removeEventListener('click', hideModalBackdrop);
    modalSettings.element.removeEventListener('keyup', modalKeypressHandler);
    modalSettings.element.className = '';
}
exports.hideModalBackdrop = hideModalBackdrop;
//# sourceMappingURL=chums-theme--modal.js.map