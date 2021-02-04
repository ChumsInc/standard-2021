/*! PhotoSwipe Default UI - 4.1.2 - 2017-04-05
* http://photoswipe.com
* Copyright (c) 2017 Dmitry Semenov; */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.PhotoSwipeUI_Default = factory();
    }
})(this, function () {
    "use strict";
    var PhotoSwipeUI_Default = function (pwsp, framework) {
        var n, i, o, r, s, a, l, c, u, p, d, f, h, m, v, _blockControlsTap, y, b, w, x = this, k = false, S = !0, C = !0, T = {
            barsSize: {top: 44, bottom: "auto"},
            closeElClasses: ["item", "caption", "zoom-wrap", "ui", "top-bar"],
            timeToIdle: 4e3,
            timeToIdleOutside: 1e3,
            loadingIndicatorDelay: 1e3,
            addCaptionHTMLFn: function (item, captionEl) {
                return item.title ? (captionEl.children[0].innerHTML = item.title, !0) : (captionEl.children[0].innerHTML = "", false)
            },
            closeEl: !0,
            captionEl: !0,
            fullscreenEl: !0,
            zoomEl: !0,
            shareEl: !0,
            counterEl: !0,
            arrowEl: !0,
            preloaderEl: !0,
            tapToClose: false,
            tapToToggleControls: !0,
            clickToCloseNonZoomable: !0,
            shareButtons: [{
                id: "facebook",
                label: "Share on Facebook",
                url: "https://www.facebook.com/sharer/sharer.php?u={{url}}"
            }, {
                id: "twitter",
                label: "Tweet",
                url: "https://twitter.com/intent/tweet?text={{text}}&url={{url}}"
            }, {
                id: "pinterest",
                label: "Pin it",
                url: "http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"
            }, {id: "download", label: "Download image", url: "{{raw_image_url}}", download: !0}],
            getImageURLForShare: function () {
                return pwsp.currItem.src || ""
            },
            getPageURLForShare: function () {
                return window.location.href
            },
            getTextForShare: function () {
                return pwsp.currItem.title || ""
            },
            indexIndicatorSep: " / ",
            fitControlsWidth: 1200
        }, E = function (e) {
            if (_blockControlsTap) return !0;
            e = e || window.event, v.timeToIdle && v.mouseUsed && !u && _onIdleMouseMove();
            for (var n, found, target = e.target || e.srcElement, r = target.getAttribute("class") || "", s = 0; s < _uiElements.length; s++) n = _uiElements[s], n.onTap && r.indexOf("pswp__" + n.name) > -1 && (n.onTap(), found = !0);
            if (found) {
                e.stopPropagation && e.stopPropagation(), _blockControlsTap = true;
                var a = framework.features.isOldAndroid ? 600 : 30;
                y = setTimeout(function () {
                    _blockControlsTap = false
                }, a)
            }
        }, _ = function () {
            return !pwsp.likelyTouchDevice || v.mouseUsed || screen.width > v.fitControlsWidth
        }, A = function (e, n, i) {
            framework[(i ? "add" : "remove") + "Class"](e, "pswp__" + n)
        }, P = function () {
            var e = 1 === v.getNumItemsFn();
            e !== m && (A(i, "ui--one-slide", e), m = e)
        }, O = function () {
            A(l, "share-modal--hidden", C)
        }, N = function () {
            return C = !C, C ? (framework.removeClass(l, "pswp__share-modal--fade-in"), setTimeout(function () {
                C && O()
            }, 300)) : (O(), setTimeout(function () {
                C || framework.addClass(l, "pswp__share-modal--fade-in")
            }, 30)), C || $(), false
        }, I = function (t) {
            t = t || window.event;
            var n = t.target || t.srcElement;
            return pwsp.shout("shareLinkClick", t, n), !(!n.href || !n.hasAttribute("download") && (window.open(n.href, "pswp_share", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left=" + (window.screen ? Math.round(screen.width / 2 - 275) : 100)), C || N(), 1))
        }, $ = function () {
            for (var e, t, n, i, o, r = "", s = 0; s < v.shareButtons.length; s++) e = v.shareButtons[s], n = v.getImageURLForShare(e), i = v.getPageURLForShare(e), o = v.getTextForShare(e), t = e.url.replace("{{url}}", encodeURIComponent(i)).replace("{{image_url}}", encodeURIComponent(n)).replace("{{raw_image_url}}", n).replace("{{text}}", encodeURIComponent(o)), r += '<a href="' + t + '" target="_blank" class="pswp__share--' + e.id + '"' + (e.download ? "download" : "") + ">" + e.label + "</a>", v.parseShareButtonOut && (r = v.parseShareButtonOut(e, r));
            l.children[0].innerHTML = r, l.children[0].onclick = I
        }, D = function (e) {
            for (var n = 0; n < v.closeElClasses.length; n++) if (framework.hasClass(e, "pswp__" + v.closeElClasses[n])) return true
        }, L = 0, _onIdleMouseMove = function () {
            clearTimeout(w), L = 0, u && x.setIdle(false)
        }, M = function (e) {
            e = e ? e : window.event;
            var t = e.relatedTarget || e.toElement;
            t && "HTML" !== t.nodeName || (clearTimeout(w), w = setTimeout(function () {
                x.setIdle(true)
            }, v.timeToIdleOutside))
        }, j = function () {
            v.fullscreenEl && !framework.features.isOldAndroid && (n || (n = x.getFullscreenAPI()), n ? (framework.bind(document, n.eventK, x.updateFullscreen), x.updateFullscreen(), framework.addClass(pwsp.template, "pswp--supports-fs")) : framework.removeClass(pwsp.template, "pswp--supports-fs"))
        }, H = function () {
            v.preloaderEl && (F(true), p("beforeChange", function () {
                clearTimeout(h), h = setTimeout(function () {
                    pwsp.currItem && pwsp.currItem.loading ? (!pwsp.allowProgressiveImg() || pwsp.currItem.img && !pwsp.currItem.img.naturalWidth) && F(false) : F(true)
                }, v.loadingIndicatorDelay)
            }), p("imageLoadComplete", function (t, n) {
                pwsp.currItem === n && F(true)
            }))
        }, F = function (e) {
            f !== e && (A(d, "preloader--active", !e), f = e)
        }, R = function (e) {
            var n = e.vGap;
            if (_()) {
                var s = v.barsSize;
                if (v.captionEl && "auto" === s.bottom) if (r || (r = framework.createEl("pswp__caption pswp__caption--fake"), r.appendChild(framework.createEl("pswp__caption__center")), i.insertBefore(r, o), framework.addClass(i, "pswp__ui--fit")), v.addCaptionHTMLFn(e, r, true)) {
                    var a = r.clientHeight;
                    n.bottom = parseInt(a, 10) || 44
                } else n.bottom = s.top; else n.bottom = "auto" === s.bottom ? 0 : s.bottom;
                n.top = s.top
            } else n.top = n.bottom = 0
        }, q = function () {
            v.timeToIdle && p("mouseUsed", function () {
                framework.bind(document, "mousemove", _onIdleMouseMove), framework.bind(document, "mouseout", M), b = setInterval(function () {
                    L++, 2 === L && x.setIdle(true)
                }, v.timeToIdle / 2)
            })
        }, B = function () {
            p("onVerticalDrag", function (e) {
                S && e < .95 ? x.hideControls() : !S && e >= .95 && x.showControls()
            });
            var e;
            p("onPinchClose", function (t) {
                S && t < .9 ? (x.hideControls(), e = true) : e && !S && t > .9 && x.showControls()
            }), p("zoomGestureEnded", function () {
                e = false, e && !S && x.showControls()
            })
        }, _uiElements = [{
            name: "caption", option: "captionEl", onInit: function (e) {
                o = e
            }
        }, {
            name: "share-modal", option: "shareEl", onInit: function (e) {
                l = e
            }, onTap: function () {
                N()
            }
        }, {
            name: "button--share", option: "shareEl", onInit: function (e) {
                a = e
            }, onTap: function () {
                N()
            }
        }, {name: "button--zoom", option: "zoomEl", onTap: pwsp.toggleDesktopZoom}, {
            name: "counter",
            option: "counterEl",
            onInit: function (e) {
                s = e
            }
        }, {name: "button--close", option: "closeEl", onTap: pwsp.close}, {
            name: "button--arrow--left",
            option: "arrowEl",
            onTap: pwsp.prev
        }, {name: "button--arrow--right", option: "arrowEl", onTap: pwsp.next}, {
            name: "button--fs",
            option: "fullscreenEl",
            onTap: function () {
                n.isFullscreen() ? n.exit() : n.enter()
            }
        }, {
            name: "preloader", option: "preloaderEl", onInit: function (e) {
                d = e
            }
        }], U = function () {
            var e, n, o, r = function (i) {
                if (i) for (var r = i.length, s = 0; s < r; s++) {
                    e = i[s], n = e.className;
                    for (var a = 0; a < _uiElements.length; a++) o = _uiElements[a], n.indexOf("pswp__" + o.name) > -1 && (v[o.option] ? (framework.removeClass(e, "pswp__element--disabled"), o.onInit && o.onInit(e)) : framework.addClass(e, "pswp__element--disabled"))
                }
            };
            r(i.children);
            var s = framework.getChildByClass(i, "pswp__top-bar");
            s && r(s.children)
        };
        x.init = function () {
            framework.extend(pwsp.options, T, true), v = pwsp.options, i = framework.getChildByClass(pwsp.scrollWrap, "pswp__ui"), p = pwsp.listen, B(), p("beforeChange", x.update), p("doubleTap", function (t) {
                var n = pwsp.currItem.initialZoomLevel;
                pwsp.getZoomLevel() !== n ? pwsp.zoomTo(n, t, 333) : pwsp.zoomTo(v.getDoubleTapZoom(false, pwsp.currItem), t, 333)
            }), p("preventDragEvent", function (e, t, n) {
                var i = e.target || e.srcElement;
                i && i.getAttribute("class") && e.type.indexOf("mouse") > -1 && (i.getAttribute("class").indexOf("__caption") > 0 || /(SMALL|STRONG|EM)/i.test(i.tagName)) && (n.prevent = false)
            }), p("bindEvents", function () {
                framework.bind(i, "pswpTap click", E), framework.bind(pwsp.scrollWrap, "pswpTap", x.onGlobalTap), pwsp.likelyTouchDevice || framework.bind(pwsp.scrollWrap, "mouseover", x.onMouseOver)
            }), p("unbindEvents", function () {
                C || N(), b && clearInterval(b), framework.unbind(document, "mouseout", M), framework.unbind(document, "mousemove", _onIdleMouseMove), framework.unbind(i, "pswpTap click", E), framework.unbind(pwsp.scrollWrap, "pswpTap", x.onGlobalTap), framework.unbind(pwsp.scrollWrap, "mouseover", x.onMouseOver), n && (framework.unbind(document, n.eventK, x.updateFullscreen), n.isFullscreen() && (v.hideAnimationDuration = 0, n.exit()), n = null)
            }), p("destroy", function () {
                v.captionEl && (r && i.removeChild(r), framework.removeClass(o, "pswp__caption--empty")), l && (l.children[0].onclick = null), framework.removeClass(i, "pswp__ui--over-close"), framework.addClass(i, "pswp__ui--hidden"), x.setIdle(false)
            }), v.showAnimationDuration || framework.removeClass(i, "pswp__ui--hidden"), p("initialZoomIn", function () {
                v.showAnimationDuration && framework.removeClass(i, "pswp__ui--hidden")
            }), p("initialZoomOut", function () {
                framework.addClass(i, "pswp__ui--hidden")
            }), p("parseVerticalMargin", R), U(), v.shareEl && a && l && (C = true), P(), q(), j(), H()
        }, x.setIdle = function (e) {
            u = e, A(i, "ui--idle", e)
        }, x.update = function () {
            S && pwsp.currItem ? (x.updateIndexIndicator(), v.captionEl && (v.addCaptionHTMLFn(pwsp.currItem, o), A(o, "caption--empty", !pwsp.currItem.title)), k = true) : k = false, C || N(), P()
        }, x.updateFullscreen = function (i) {
            i && setTimeout(function () {
                pwsp.setScrollOffset(0, framework.getScrollY())
            }, 50), framework[(n.isFullscreen() ? "add" : "remove") + "Class"](pwsp.template, "pswp--fs")
        }, x.updateIndexIndicator = function () {
            v.counterEl && (s.innerHTML = pwsp.getCurrentIndex() + 1 + v.indexIndicatorSep + v.getNumItemsFn())
        }, x.onGlobalTap = function (n) {
            n = n || window.event;
            var i = n.target || n.srcElement;
            if (!_blockControlsTap) if (n.detail && "mouse" === n.detail.pointerType) {
                if (D(i)) return void pwsp.close();
                framework.hasClass(i, "pswp__img") && (1 === pwsp.getZoomLevel() && pwsp.getZoomLevel() <= pwsp.currItem.fitRatio ? v.clickToCloseNonZoomable && pwsp.close() : pwsp.toggleDesktopZoom(n.detail.releasePoint))
            } else if (v.tapToToggleControls && (S ? x.hideControls() : x.showControls()), v.tapToClose && (framework.hasClass(i, "pswp__img") || D(i))) return void pwsp.close()
        }, x.onMouseOver = function (e) {
            e = e || window.event;
            var t = e.target || e.srcElement;
            A(i, "ui--over-close", D(t))
        }, x.hideControls = function () {
            framework.addClass(i, "pswp__ui--hidden"), S = false
        }, x.showControls = function () {
            S = true, k || x.update(), framework.removeClass(i, "pswp__ui--hidden")
        }, x.supportsFullscreen = function () {
            var e = document;
            return !!(e.exitFullscreen || e.mozCancelFullScreen || e.webkitExitFullscreen || e.msExitFullscreen)
        }, x.getFullscreenAPI = function () {
            var t, n = document.documentElement, i = "fullscreenchange";
            return n.requestFullscreen ? t = {
                enterK: "requestFullscreen",
                exitK: "exitFullscreen",
                elementK: "fullscreenElement",
                eventK: i
            } : n.mozRequestFullScreen ? t = {
                enterK: "mozRequestFullScreen",
                exitK: "mozCancelFullScreen",
                elementK: "mozFullScreenElement",
                eventK: "moz" + i
            } : n.webkitRequestFullscreen ? t = {
                enterK: "webkitRequestFullscreen",
                exitK: "webkitExitFullscreen",
                elementK: "webkitFullscreenElement",
                eventK: "webkit" + i
            } : n.msRequestFullscreen && (t = {
                enterK: "msRequestFullscreen",
                exitK: "msExitFullscreen",
                elementK: "msFullscreenElement",
                eventK: "MSFullscreenChange"
            }), t && (t.enter = function () {
                return c = v.closeOnScroll, v.closeOnScroll = false, "webkitRequestFullscreen" !== this.enterK ? pwsp.template[this.enterK]() : void pwsp.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT)
            }, t.exit = function () {
                return v.closeOnScroll = c, document[this.exitK]()
            }, t.isFullscreen = function () {
                return document[this.elementK]
            }), t
        }
    };
    return PhotoSwipeUI_Default
});
