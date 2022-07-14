if (window.CHUMS === undefined) {
  var CHUMS = window.CHUMS = {};
}
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

(function () {
  function intersect (a, b) {
    return a.filter(function (v) {
      return b.includes(v);
    });
  }

  function makeClassSelector(className) {
    return '.' + className;
  }
  
  function filterColorSwatch(className) {
    return reColorSwatch.test(className) && !reColorSwatchSize.test(className);
  }
      
  var reColorSwatch = /^color-swatch--[\w\-]+$/;
  var reColorSwatchSize = /^color-swatch(--small|)$/;
  
  var classes = {
    productHidden: 'grid-product--hidden',
    tagActive: 'tag--active',
    tagHidden: 'tag--hidden',
    tagItem: 'tag',
    tagRemove: 'tag--remove-filter',
    tagRemoveFilters: 'tag--remove-filters',
    tagSwatch: 'tag--swatch',    
    hasFilters: 'has-filters',
  };

  var selectors = {
    container: '#collection-sidebar-filter-container',
    group: '.collection-sidebar__group',
    groupSelectedCount: '.tag-list--count',
    groupTotalCount: '.tag-list--total-tags',
    productsContainer: '#shopify-section-collection-filterable-products',
    product: '.grid-product',
    removeURLFilter: '.tag--remove-url',
    swatch: '.color-swatch',
    swatchList: '.tag-list--swatches',
    tagItem: makeClassSelector(classes.tagItem),
    tagItemActive: makeClassSelector(classes.tagActive),
    tagList: '.tag-list--checkboxes',
    tagSwatch: makeClassSelector(classes.tagSwatch),
    tagRemoveFilters: makeClassSelector(classes.tagRemoveFilters),
    noProductsWarning: '.collection-filter__item--warning'
  };
  
  
  function RetainerChooser() {
    this.container = document.querySelector(selectors.container);
    if (!this.container) {
      return;
    }
    this.urlFilters = [];
    this.productsContainer = document.querySelector(selectors.productsContainer);
    this.productGroups = {};
    this.tagGroups = {};
    this.enabledProducts = [];

    this.swatchList = [];
    this.swatchContainer = this.container.querySelector(selectors.swatchList);

    this.onClickLink = this.onClickLink.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.updateEnabledProuducts = this.updateEnabledProducts.bind(this);
    this.updateProductGroup = this.updateProductGroup.bind(this);
    this.intersectGroups = this.intersectGroups.bind(this);
    this.showClearFilters = this.showClearFilters.bind(this);
    this.onClearFilters = this.onClearFilters.bind(this);
    
    this.init();
    
  };
  
  RetainerChooser.prototype.init = function () {
    this.buildColors();
    this.urlFilters = Array.from(this.container.querySelectorAll(selectors.removeURLFilter))
    .map(function (el) {
      return el.dataset.forAttribute;
    });
    
    this.updateSelectedTagCount();

    // this.container.addEventListener('click', this.onClickLink);
    this.container.addEventListener('change', this.changeHandler);
    var clearFilters = this.container.querySelector(selectors.tagRemoveFilters);
    if (clearFilters) {
      clearFilters.addEventListener('click', this.onClearFilters);
    }
  };

  RetainerChooser.prototype.onClickLink = function (ev) {
    var el = ev.target.classList.contains(classes.tagItem) ? ev.target : ev.target.closest(selectors.tagItem);
    // if the clicked element does not have a parent 'tag' className then it's not the element we are listening for
    // * also, if it's got a 'tag--remove' className then we want to allow so that we can remove assigned tags from menu navigation.
    if (!el || el.classList.contains(classes.tagRemove)) {
      return;
    }
    ev.preventDefault();
  }

  RetainerChooser.prototype.changeHandler = function (ev) {
    // console.log(ev.target);
    var el = ev.target;
    if (!el) {
      return;
    }

    this.productGroups = {};
    const filters = this.container.querySelectorAll('input[type="checkbox"]:checked');

    filters.forEach(el => {
      const key = el.dataset.filter;
      let products = [];
      try {
          products = JSON.parse(el.dataset.products);
      } catch(err) {
          console.log("changeHandler()", err.message);
      }
      if (!key) {
        return;
      }
      if (!this.productGroups[key]) {
        this.productGroups[key] = [];
      }
      products.forEach(p => {
        if (this.productGroups[key].indexOf(p) === -1) {
          this.productGroups[key].push(p)
        }
      });
    });
    console.log(this.productGroups);
    Object.keys(this.productGroups).forEach(key => {

    })
    // return;
    // // if (el.classList.contains(classes.tagSwatch)) {
    // //   this.onClickColorTag(el);
    // // } else {
    // //   el.classList.toggle(classes.tagActive);
    // // }
    // this.enabledProducts = [];
    // try {
    //   this.enabledProducts = JSON.parse(el.dataset.products);
    // } catch(err) {
    //     console.log("changeHandler()", err.message);
    //     return;
    // }
    // // this.updateEnabledProducts();
    this.showProducts();
    // this.showClearFilters();
  };


  RetainerChooser.prototype.shouldShowProduct = function (product) {
    let shouldShow = true;
    Object.keys(this.productGroups).forEach(key => {
      shouldShow = shouldShow && (this.productGroups[key].indexOf(product) !== -1);
    })
    return shouldShow;
  }
  
  RetainerChooser.prototype.onClickColorTag = function (el) {
    var isActive = el.classList.contains(classes.tagActive);
    el.closest(selectors.swatchList).querySelectorAll(selectors.tagItemActive)
    .forEach(function (el) {
      el.classList.remove(classes.tagActive);
    });
    // if the current el was not the active tag, make it active, otherwise just toggle it off.
    if (!isActive) {
      el.classList.add(classes.tagActive);        
    }
  };
  
  RetainerChooser.prototype.showClearFilters = function () {
    var urlFilters = this.urlFilters;
    var visible = Array.from(this.container.querySelectorAll(selectors.tagItemActive))
    .filter(function (el) {
      return !urlFilters.includes(el.dataset.attribute);
    })
    .filter(function (el) {
      return !el.classList.contains(classes.tagRemoveFilters);
    }).length > 0;
    
    this.container.querySelectorAll(selectors.tagRemoveFilters)
    .forEach(function (el) {
      if (visible) {
        el.classList.add(classes.hasFilters);
      } else {
        el.classList.remove(classes.hasFilters);
      }
      
    });
  };
  
  RetainerChooser.prototype.onClearFilters = function () {
    var urlFilters = this.urlFilters;
    Array.from(this.container.querySelectorAll(selectors.tagItemActive))
    .filter(function (el) {
      return !urlFilters.includes(el.dataset.attribute);
    })
    .filter(function (el) {
      return !el.classList.contains(classes.tagRemoveFilters);
    })
    .forEach(function (el) {
      var event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      console.log('onClearFilters()', el); 
      el.dispatchEvent(event);
    });
  };
  
  /**
   * Update count of selected tags for a group, or all groups if groupEl is not defined
   * @param {Element} [groupEl] 
   * @return undefined
   */
  RetainerChooser.prototype.updateSelectedTagCount = function (groupEl) {
    if (!groupEl) {
      this.container.querySelectorAll(selectors.tagList).forEach(this.updateSelectedTagCount);
      return;
    }
    var tags = Array.from(groupEl.querySelectorAll(selectors.tagItemActive)).length;
    var countEl = groupEl.closest(selectors.group).querySelector(selectors.groupSelectedCount);
    countEl.innerHTML = tags;
  };

  RetainerChooser.prototype.updateEnabledProducts = function () {
    this.enabledProducts = [];
    this.productGroups = {};


    
    var tagLists = this.container.querySelectorAll(selectors.tagList);
    tagLists.forEach(this.updateProductGroup);
    tagLists.forEach(this.updateSelectedTagCount);

    var groups = Object.keys(this.productGroups);
    groups.forEach(this.intersectGroups);
  };
  
  RetainerChooser.prototype.updateProductGroup = function (groupEl) {
    var self = this;
    var group = groupEl.dataset.productGroup;
    if (!group) {
      return;
    }
    this.tagGroups[group] = {};
    this.productGroups[group] = [];
    var tagList = groupEl.querySelectorAll(selectors.tagItemActive);
    this.tagGroups[group].hasProducts = tagList.length > 0;
    tagList.forEach(function (el) {
      var products = JSON.parse(el.dataset.products || '[]');
      products.forEach(function (p) {
        if (!self.productGroups[group].includes(p)) {
          self.productGroups[group].push(p);
        }
      });
    });
    
  };
    
  RetainerChooser.prototype.intersectGroups = function (group) {
    var products = this.productGroups[group];
    var hasSelection = this.tagGroups[group].hasProducts || false;
      if (products.length === 0 && !hasSelection) {
        return;
      }
      if (this.enabledProducts.length === 0) {
        this.enabledProducts = Array.from(products);
        return;
      }
      this.enabledProducts = intersect(this.enabledProducts, products);       
  };
  
  RetainerChooser.prototype.showProducts = function () {
    if (Object.keys(this.productGroups).length === 0) {
      this.productsContainer.querySelectorAll(selectors.product)
          .forEach(el => el.classList.toggle(classes.productHidden, false));
    }
    this.productsContainer.querySelectorAll(selectors.product)
        .forEach(el => el.classList.toggle(classes.productHidden, !this.shouldShowProduct(el.dataset.product)));

    const allHidden = this.productsContainer.querySelectorAll('.grid-product:not(.grid-product--hidden)').length === 0;
    this.productsContainer.querySelectorAll('#product-grid--all-filtered').forEach(el => el.classList.toggle('d-none', !allHidden));
    var top = this.productsContainer.querySelector('.collection-filter');
    if (top) {
      top.scrollIntoView();
    }
  };
  
  RetainerChooser.prototype.selectColors = function () {
	var selectedColors = this.getSelectedColors();
    
    if (selectedColors.length === 0) {      
      this.productsContainer.querySelectorAll('.tag-active')
      .forEach(function (selectedSwatch) {
        var ev = new Event('unselect');
        selectedSwatch.dispatchEvent(ev);
      })
    }
    
    var products = Array.from(this.productsContainer.querySelectorAll(selectors.product));
    var enabledProducts = this.enabledProducts;

    products
    .filter(function (el) {
    	return enabledProducts.includes(el.dataset.product || 'n/a');
    })
    .map(function (el) {
      var done = false
      selectedColors.forEach(function (color) {
        if (done) {
          return; // already found a matching color so skip the rest
        }
        var swatch = el.querySelector(makeClassSelector(color));
        if (swatch) {
          done = true;
	      var ev = new Event('select');
          swatch.dispatchEvent(ev);
        }
      });
    });
  };
  
  RetainerChooser.prototype.getSelectedColors = function () {
    if (!this.swatchContainer) {
     return [];
    }
    var swatchFilter = /color-swatch--\w+/g;
    var swatches = [];
    var activeSwatches = this.swatchContainer.querySelectorAll(selectors.tagItemActive);
    activeSwatches.forEach(function (el) {
      var classNames = Array.from(el.classList).filter(filterColorSwatch);
      classNames.forEach(function (cn) {
        swatches.push(cn);
      });
    });
    return swatches;
  }
  
  RetainerChooser.prototype.buildSwatchList = function () {
    var self = this;
    var colors = {};
    
    var products = Array.from(this.productsContainer.querySelectorAll(selectors.product));
    products.filter(function (productEl) {
      return productEl.classList.contains(classes.productHidden) === false;
    })
    .forEach(function (productEl) {
      var productHandle = productEl.dataset.product;
      productEl.querySelectorAll(selectors.swatch)
      .forEach(function (el) {
        var code = el.dataset.swatchFilter;
        var name = el.dataset.swatchName;
        if (!code) {
          return;
        }
        if (colors[code] === undefined) {
          colors[code] = {name: name, swatch: code, products: []};
        }
        if (!colors[code].products.includes(productHandle)) {
          colors[code].products.push(productHandle);
        }
      });
    });
    
    return Object.keys(colors)
    .sort()
    .map(function (key) {
      return colors[key];
    });
  };
  
  RetainerChooser.prototype.buildColors = function () {
    var swatchContainer = this.container.querySelector(selectors.swatchList);
    if (!swatchContainer) {
      return;
    }
    var selectedColors = Array.from(swatchContainer.querySelectorAll(selectors.tagItemActive))
    .map(function (el) {
      return el.dataset.colorCode;
    });
    
    this.swatchList = this.buildSwatchList();
    if (this.swatchList.length === 0) {
      swatchContainer.closest(selectors.group).style.display = 'none'
    }

    while(swatchContainer.firstChild) {
		swatchContainer.removeChild(swatchContainer.firstChild);      
    }
    this.swatchList.forEach(function (color) {
      var li = document.createElement('li');
      li.classList.add(classes.tagItem);
      li.classList.add(classes.tagSwatch);
      li.classList.add('color-swatch-filter--' + color.swatch);
      li.classList.add('color-swatch--small');
      if (selectedColors.includes(color.swatch)) {
        li.classList.add(classes.tagActive);
      }
      li.innerText = color.name;
      li.title = color.swatch;
      li.dataset.products = JSON.stringify(color.products);
      li.dataset.colorCode = color.swatch;
      swatchContainer.appendChild(li);
    })
    var groupTotalCount = this.swatchContainer.closest(selectors.group).querySelector(selectors.groupTotalCount);
    if (groupTotalCount && groupTotalCount.innerText === '0') {
      groupTotalCount.innerText = this.swatchList.length;
    }
  };
  
  RetainerChooser.prototype.showColorSwatches = function (visible) {
    if (visible === undefined) {
      visible = true;
    }
    this.swatchContainer.querySelectorAll(selectors.tagSwatch)
    .forEach(function (el) {
      if (visible) {
        el.classList.remove(classes.tagHidden);
      } else {
        el.classList.add(classes.tagHidden);
      }     
    });
  };
  
  RetainerChooser.prototype.hideColorSwatches = function () {
    var self = this;
    var visibleList = this.buildSwatchList();
    this.showColorSwatches(false);
    
    visibleList.forEach(function (color) {
      var el = self.swatchContainer.querySelector('.color-swatch-filter--' + color.swatch);
      if (el) {
        el.classList.remove(classes.tagHidden);
      }
    });
    
  };
  
  CHUMS.retainerChooser = new RetainerChooser();

}());
