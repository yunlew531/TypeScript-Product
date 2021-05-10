let productData: IProductData[] = [{id: 1620653811618, title: '義大利麵', originPrice: 200, price: 150, enable: true}, {id: 1620657379674, title: '焗烤', originPrice: 230, price: 200, enable: false}];
let renderStatus = 'render-all';
const title: HTMLInputElement = document.querySelector('#title');
const originPrice: HTMLInputElement = document.querySelector('#origin-price');
const price: HTMLInputElement = document.querySelector('#price');
const enable: HTMLInputElement = document.querySelector('#enable');
const addProductForm: HTMLFormElement = document.querySelector('#add-product-form');
const addProductBtn: HTMLButtonElement = document.querySelector('#add-product-btn');
const renderStatusBtnGroup: HTMLDivElement = document.querySelector('#render-status-group');
const deleteAllBtn: HTMLButtonElement = document.querySelector('#delete-all-btn');
const productList: HTMLLIElement = document.querySelector('#product-list');
const productNumText: HTMLParagraphElement = document.querySelector('#product-num-text');

interface IProductData {
  id: number,
  title: string,
  originPrice: number,
  price: number,
  enable: boolean,
};

function addProduct(e: Event) {
  const obj = {
    id: Date.now(),
    title: title.value,
    originPrice: parseInt(originPrice.value),
    price: parseInt(price.value),
  } as IProductData;
  for (const props in obj) {
    if (!obj[props] && obj[props] !== 0) return;
  }
  obj.enable = enable.checked;
  productData.push(obj);
  renderProduct(productData);
  addProductForm.reset();
  e.preventDefault();
}

addProductBtn.addEventListener('click', addProduct);

function renderProduct(arr: IProductData[]) {
  const renderStatusDom = document.querySelector(`[data-btn="${renderStatus}"]`);
  let template = '';
  arr.forEach((product) => {
    template+= `
    <tr data-id="${product.id}">
        <td class="py-2 px-3 align-middle">${product.title}</td>
        <td class="py-2 px-3 align-middle">$${product.originPrice}</td>
        <td class="py-2 px-3 align-middle">$${product.price}</td>
        <td class="py-2 px-3">
          <label class="flex items-center">
            <span data-action="changeStatus" data-id="${product.id}"
              class="product-status inline-block bg-gray-200 w-9 h-5 rounded-full
              relative border border-gray-500 border-solid
              group cursor-pointer">
              <span data-action="changeStatus" data-id="${product.id}"
                class="product-status block absolute w-3.5 h-3.5
                ${product.enable ? `bg-green-500 right-1` :
                                   `bg-gray-400 left-1`}
                rounded-full ring-1 ring-gray-500
                top-1/2 transform -translate-y-1/2">
              </span>
            </span>
            <span 
              class="ml-1.5 ${product.enable ? 'text-green-400' : 'text-red-400'}">
              ${product.enable ? '啟用' : '未啟用'}
            </span>
          </label>
        </td>
        <td class="py-2 px-3">
          <button type="button"
                  class="text-red-500 border border-red-500 rounded
                         hover:bg-red-600 duration-200
                         hover:text-white leading-none flex">
            <span  data-action="deleteProduct" data-id="${product.id}"
              class="delete-btn px-0.5 h-full material-icons">delete</span>
          </button>
        </td>
      </tr>
    `;
  });
  productList.innerHTML = template;
  productNumText.textContent = `目前有 ${arr.length} 項產品`;
  const nodesArr = renderStatusBtnGroup.childNodes as NodeList;
  nodesArr.forEach((node: any) => {
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

function productListListener(e: Event) {
  const target = e.target as HTMLElement;
  const id = parseInt(target.dataset.id);
  if (target.dataset.action === 'changeStatus') {
    changeStatus(id);
  } else if (target.dataset.action === 'deleteProduct') {
    deleteProduct(id);
  }
}

function changeStatus(id: number) {
  productData.forEach((product) => {
    if (product.id === id) {
      product.enable = !product.enable;
    }
  });
  filterProducts(null);
}

function deleteProduct(id: number) {
  productData.forEach((product, idx) => {
    if (product.id === id) {
      productData.splice(idx, 1);
    }
    renderProduct(productData);
  });
}

productList.addEventListener('click', productListListener);

function filterProducts(e: Event) {
  let filterData: IProductData[] = [];
  if (e) {
    const target = e.target as HTMLElement;
    if (!target.dataset.btn) return;
    if (target.dataset.btn === 'render-all') {
      renderStatus = 'render-all';
    } else if (target.dataset.btn === 'render-enable') {
      renderStatus = 'render-enable';
    } else if (target.dataset.btn === 'render-disabled') {
      renderStatus = 'render-disabled';
    }
  }

  if (renderStatus === 'render-all') {
    filterData = productData;
  } else if (renderStatus === 'render-enable') {
    filterData = productData.filter(product => product.enable);
  } else if (renderStatus === 'render-disabled') {
    filterData = productData.filter(product => !product.enable);
  } 
  renderProduct(filterData);
}

renderStatusBtnGroup.addEventListener('click', filterProducts);