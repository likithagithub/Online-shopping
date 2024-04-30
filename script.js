document.addEventListener('DOMContentLoaded', function() {
    fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json')
        .then(response => response.json())
        .then(data => initializePage(data.product))
        .catch(error => console.error('Error loading product data:', error));
        const thumbnails = [
            't1.png',
            't2.png',
            't3.png',
            't4.png',
        ];
    
        initializeThumbnails(thumbnails);
});

function initializePage(product) {
    document.getElementById('product-vendor').textContent = product.vendor;
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('price').textContent = product.price;
    document.getElementById('compare-at-price').textContent = `${product.compare_at_price}`;
    document.getElementById('description').innerHTML = product.description;
    document.getElementById('increment').addEventListener('click', function() {updateQuantity(1);});
    document.getElementById('decrement').addEventListener('click', function() {updateQuantity(-1);});
    const discountPercent = calculateDiscountPercent(product.price, product.compare_at_price);
    document.getElementById('discount-percent').textContent = `${discountPercent}% Off`;
    const colorVariantsContainer = document.getElementById('color-variants');
    product.options.find(option => option.name === "Color").values.forEach(color => {
        const colorDiv = document.createElement('div');
        const colorName = Object.keys(color)[0];
        colorDiv.style.backgroundColor = color[colorName];
        colorDiv.className = 'color-variant'; 
        colorDiv.dataset.colorName = colorName;
        colorDiv.onclick = () => updateVariantSelection('color', colorName);
        colorVariantsContainer.appendChild(colorDiv);

    });
    

const sizeVariantsContainer = document.getElementById('size-variants');
const sizesWrapper = document.createElement('div');
sizesWrapper.style.display = 'flex';
sizesWrapper.style.flexWrap = 'nowrap'; 
sizesWrapper.style.gap = '10px';

product.options.find(option => option.name === "Size").values.forEach(size => {
    const sizeLabel = document.createElement('label');
    const sizeInput = document.createElement('input');
    sizeInput.type = 'radio';
    sizeInput.name = 'size';
    sizeInput.value = size;
    sizeInput.style.marginRight = '2px';
    sizeInput.onchange = () => updateVariantSelection('size', size);

    sizeLabel.appendChild(sizeInput);
    sizeLabel.appendChild(document.createTextNode(size));
    
    sizesWrapper.appendChild(sizeLabel);
});

sizeVariantsContainer.appendChild(sizesWrapper);
document.getElementById('add-to-cart').addEventListener('click', () => addToCart(product));
}

function initializeThumbnails(thumbnailNames) {
    const thumbnailContainer = document.getElementById('thumbnail-images');
    let isFirstThumbnail = true;

    thumbnailNames.forEach(name => {
        const imgElement = document.createElement('img');
        imgElement.src = `assets/${name}`;
        imgElement.classList.add('thumbnail');
        imgElement.onclick = () => changeMainImage(`assets/${name}`);
        thumbnailContainer.appendChild(imgElement);
});
}
function changeMainImage(newImageSrc) {
    const mainImage = document.getElementById('main-image');
    mainImage.src = newImageSrc;
}    
    
function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let quantity = parseInt(quantityInput.value);
    quantity += change;
    if (quantity < 1) quantity = 1; 
    quantityInput.value = quantity;
    selectedVariants.quantity = quantity; 
}
    function calculateDiscountPercent(price, compareAtPrice) {
    let priceNumber = parseFloat(price.replace('$',"")).toFixed(2);
    let compareAtPriceNumber = parseFloat(compareAtPrice.replace('$',"")).toFixed(2);
    console.log(`Parsed price: ${priceNumber}, Parsed compare at price: ${compareAtPriceNumber}`); 
    const discount=((compareAtPriceNumber - priceNumber) / compareAtPriceNumber) * 100;
    //priceNumber = `$${priceNumber.toFixed(2)}`;
    //compareAtPriceNumber = `$${compareAtPriceNumber.toFixed(2)}`;
    return parseFloat(discount.toFixed(2)); 
}

let selectedVariants = { color: null, size: null, quantity: 1 };

function updateVariantSelection(variantType, value) {
    selectedVariants[variantType] = value;
    if (variantType === 'color') {
        const colorVariants = document.querySelectorAll('.color-variant');
        colorVariants.forEach(div => {
            if (div.dataset.colorName === value) {
                div.classList.add('selected'); 
            } else {
                div.classList.remove('selected'); 
            }
        });
    }
}

function addToCart(product) {
    const message = `Embrace Sideboard with Color ${selectedVariants.color} and Size ${selectedVariants.size} added to cart`;
    const cartMessageElement = document.getElementById('add-to-cart-message');
    cartMessageElement.textContent = message;
    cartMessageElement.style.display = 'block';
    
}
