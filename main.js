var productData = [{ id: 1620653811618, title: '義大利麵', originPrice: 200, price: 150, enable: true }, { id: 1620657379674, title: '焗烤', originPrice: 230, price: 200, enable: false }];
var renderStatus = 'render-all';
var title = document.querySelector('#title');
var originPrice = document.querySelector('#origin-price');
var price = document.querySelector('#price');
var enable = document.querySelector('#enable');
var addProductForm = document.querySelector('#add-product-form');
var addProductBtn = document.querySelector('#add-product-btn');
var renderStatusBtnGroup = document.querySelector('#render-status-group');
var deleteAllBtn = document.querySelector('#delete-all-btn');
var productList = document.querySelector('#product-list');
var productNumText = document.querySelector('#product-num-text');
;
function addProduct(e) {
    var obj = {
        id: Date.now(),
        title: title.value,
        originPrice: parseInt(originPrice.value),
        price: parseInt(price.value)
    };
    for (var props in obj) {
        if (!obj[props] && obj[props] !== 0)
            return;
    }
    obj.enable = enable.checked;
    productData.push(obj);
    renderProduct(productData);
    addProductForm.reset();
    e.preventDefault();
}
addProductBtn.addEventListener('click', addProduct);
function renderProduct(arr) {
    var renderStatusDom = document.querySelector("[data-btn=\"" + renderStatus + "\"]");
    var template = '';
    arr.forEach(function (product) {
        template += "\n    <tr data-id=\"" + product.id + "\">\n        <td class=\"py-2 px-3 align-middle\">" + product.title + "</td>\n        <td class=\"py-2 px-3 align-middle\">$" + product.originPrice + "</td>\n        <td class=\"py-2 px-3 align-middle\">$" + product.price + "</td>\n        <td class=\"py-2 px-3\">\n          <label class=\"flex items-center\">\n            <span data-action=\"changeStatus\"\n              class=\"product-status inline-block bg-gray-200 w-9 h-5 rounded-full\n              relative border border-gray-500 border-solid\n              group cursor-pointer\">\n              <span data-action=\"changeStatus\"\n                class=\"product-status block absolute w-3.5 h-3.5\n                " + (product.enable ? "bg-green-500 right-1" :
            "bg-gray-400 left-1") + "\n                rounded-full ring-1 ring-gray-500\n                top-1/2 transform -translate-y-1/2\">\n              </span>\n            </span>\n            <span \n              class=\"ml-1.5 " + (product.enable ? 'text-green-400' : 'text-red-400') + "\">\n              " + (product.enable ? '啟用' : '未啟用') + "\n            </span>\n          </label>\n        </td>\n        <td class=\"py-2 px-3\">\n          <button type=\"button\"\n                  class=\"text-red-500 border border-red-500 rounded\n                         hover:bg-red-600 duration-200\n                         hover:text-white leading-none flex\">\n            <span  data-action=\"deleteProduct\"\n              class=\"delete-btn px-0.5 h-full material-icons\">delete</span>\n          </button>\n        </td>\n      </tr>\n    ";
    });
    productList.innerHTML = template;
    productNumText.textContent = "\u76EE\u524D\u6709 " + arr.length + " \u9805\u7522\u54C1";
    var nodesArr = renderStatusBtnGroup.childNodes;
    nodesArr.forEach(function (node) {
        if (node.nodeName === 'BUTTON') {
            node.classList.remove('bg-gray-300', 'font-bold');
        }
    });
    renderStatusDom.classList.add('bg-gray-300', 'font-bold');
}
renderProduct(productData);
function deleteAllProducts() {
    productData = [];
    renderProduct(productData);
}
deleteAllBtn.addEventListener('click', deleteAllProducts);
function productListListener(e) {
    var target = e.target;
    var id = parseInt(target.closest('tr').dataset.id);
    if (target.dataset.action === 'changeStatus') {
        changeStatus(id);
    }
    else if (target.dataset.action === 'deleteProduct') {
        deleteProduct(id);
    }
}
function changeStatus(id) {
    productData.forEach(function (product) {
        if (product.id === id) {
            product.enable = !product.enable;
        }
    });
    filterProducts(null);
}
function deleteProduct(id) {
    productData.forEach(function (product, idx) {
        if (product.id === id) {
            productData.splice(idx, 1);
        }
    });
    filterProducts(null);
}
productList.addEventListener('click', productListListener);
function filterProducts(e) {
    var filterData = [];
    if (e) {
        var target = e.target;
        if (!target.dataset.btn)
            return;
        if (target.dataset.btn === 'render-all') {
            renderStatus = 'render-all';
        }
        else if (target.dataset.btn === 'render-enable') {
            renderStatus = 'render-enable';
        }
        else if (target.dataset.btn === 'render-disabled') {
            renderStatus = 'render-disabled';
        }
    }
    if (renderStatus === 'render-all') {
        filterData = productData;
    }
    else if (renderStatus === 'render-enable') {
        filterData = productData.filter(function (product) { return product.enable; });
    }
    else if (renderStatus === 'render-disabled') {
        filterData = productData.filter(function (product) { return !product.enable; });
    }
    renderProduct(filterData);
}
renderStatusBtnGroup.addEventListener('click', filterProducts);
