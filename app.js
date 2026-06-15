// CONFIGURATION: Replace with your actual country code + phone number (No spaces, dashes, or + signs)
const WHATSAPP_NUMBER = "61405932828"; 
const CURRENCY = "$";

// Product Catalog Data Model (Easily add your 5-10 items here)
const products = [
    { 
        id: 1, 
        name: "Premium Soya Nuggets", 
        desc: "High protein chunks, perfect for meat alternatives and hearty stews.", 
        img: "https://unsplash.com", 
        sizes: { "500g": 4.50, "1kg": 8.00 } 
    },
    { 
        id: 2, 
        name: "Organic Rice Flakes (Poha)", 
        desc: "Lightweight, flattened parboiled rice flakes. Ideal for quick breakfasts.", 
        img: "https://unsplash.com", 
        sizes: { "500g": 3.00, "1kg": 5.50 } 
    },
    { 
        id: 3, 
        name: "Split Yellow Chickpeas", 
        desc: "Premium quality Chana Dal thoroughly polished and cleaned.", 
        img: "https://unsplash.com", 
        sizes: { "500g": 3.50, "1kg": 6.20 } 
    }
];

let cart = [];

// Simple Router function
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');
    window.scrollTo(0, 0);
    if(pageId === 'checkout') renderCart();
}

// Render Product Grid
function renderProducts() {
    const list = document.getElementById('product-list');
    if(!list) return;
    
    list.innerHTML = products.map(p => {
        const defaultSize = Object.keys(p.sizes)[0];
        return `
            <div class="col-md-4">
                <div class="card h-100 shadow-sm p-3">
                    <img src="${p.img}" class="card-img-top rounded img-fluid" style="height:200px; object-fit:cover;" alt="${p.name}">
                    <div class="card-body d-flex flex-column p-2 mt-2">
                        <h5 class="card-title fw-bold mb-1">${p.name}</h5>
                        <p class="text-muted small flex-grow-1">${p.desc.substring(0,60)}...</p>
                        <div class="mb-3">
                            <label class="small text-muted">Select Unit Weight:</label>
                            <select class="form-select form-select-sm" id="size-select-${p.id}">
                                ${Object.entries(p.sizes).map(([sz, pr]) => `<option value="${sz}">${sz} - ${CURRENCY}${pr.toFixed(2)}</option>`).join('')}
                            </select>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <button class="btn btn-sm btn-outline-secondary" onclick="viewProduct(${p.id})">Details</button>
                            <button class="btn btn-sm btn-dark" onclick="addToCart(${p.id})">Add to Basket</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render Product Detail View
function viewProduct(id) {
    const p = products.find(prod => prod.id === id);
    const container = document.getElementById('detail-container');
    container.innerHTML = `
        <button class="btn btn-sm btn-link text-dark mb-4 p-0 text-decoration-none" onclick="showPage('products')">&larr; Back to Catalog</button>
        <div class="row g-5">
            <div class="col-md-6"><img src="${p.img}" class="img-fluid rounded shadow" alt="${p.name}"></div>
            <div class="col-md-6">
                <h1 class="fw-bold mb-2">${p.name}</h1>
                <p class="text-muted mb-4">${p.desc}</p>
                <div class="mb-4" style="max-width: 250px;">
                    <label class="form-label fw-bold">Select Size Variant:</label>
                    <select class="form-select" id="detail-size-select">
                        ${Object.entries(p.sizes).map(([sz, pr]) => `<option value="${sz}">${sz} (${CURRENCY}${pr.toFixed(2)})</option>`).join('')}
                    </select>
                </div>
                <button class="btn btn-dark btn-lg px-5" onclick="addDetailToCart(${p.id})">Add Item to Cart</button>
            </div>
        </div>
    `;
    showPage('detail');
}

// Add to Cart Functions
function addToCart(id) {
    const size = document.getElementById(`size-select-${id}`).value;
    executeCartAdd(id, size);
}

function addDetailToCart(id) {
    const size = document.getElementById('detail-size-select').value;
    executeCartAdd(id, size);
}

function executeCartAdd(id, size) {
    const p = products.find(prod => prod.id === id);
    const price = p.sizes[size];
    const existing = cart.find(item => item.id === id && item.size === size);

    if(existing) {
        existing.qty++;
    } else {
        cart.push({ id: p.id, name: p.name, size: size, price: price, qty: 1 });
    }
    updateCartCounter();
    alert(`${p.name} (${size}) added to basket.`);
}

function updateCartCounter() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = totalQty;
}

// Render Checkout Page Summary
function renderCart() {
    const container = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('cart-total');
    
    if(cart.length === 0) {
        container.innerHTML = `<p class="text-muted">Your shopping cart is completely empty.</p>`;
        totalElement.innerText = `${CURRENCY}0.00`;
        return;
    }

    let grandTotal = 0;
    container.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;
        return `
            <div class="d-flex justify-content-between align-items-center mb-2 bg-white p-2 rounded shadow-sm border-start border-success border-3">
                <div>
                    <span class="fw-bold d-block">${item.name}</span>
                    <small class="text-muted">Size: ${item.size} | Qty: ${item.qty}</small>
                </div>
                <div class="text-end">
                    <span class="d-block fw-bold">${CURRENCY}${itemTotal.toFixed(2)}</span>
                    <button class="btn btn-sm text-danger p-0 text-decoration-none" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    }).join('');
    totalElement.innerText = `${CURRENCY}${grandTotal.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCounter();
    renderCart();
}

// Compile Checkout Details and redirect out to WhatsApp
function submitToWhatsApp() {
    const customerName = document.getElementById('cust-name').value.trim();
    const customerAddress = document.getElementById('cust-address').value.trim();

    if (!customerName || !customerAddress) {
        alert("Please fill in your Delivery Information before placing the order.");
        return;
    }
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    let textMessage = `*New Order Received via Web Store*\n`;
    textMessage += `=========================\n`;
    textMessage += `*Customer Name:* ${customerName}\n`;
    textMessage += `*Delivery Address:* ${customerAddress}\n\n`;
    textMessage += `*Items Ordered:*\n`;

    let grandTotal = 0;
    cart.forEach((item, i) => {
        const lineTotal = item.price * item.qty;
        grandTotal += lineTotal;
        textMessage += `${i + 1}. ${item.name} (${item.size})\n`;
        textMessage += `   _Qty:_ ${item.qty} x ${CURRENCY}${item.price.toFixed(2)} = *${CURRENCY}${lineTotal.toFixed(2)}*\n`;
    });

    textMessage += `\n=========================\n`;
    textMessage += `*Grand Total Value:* ${CURRENCY}${grandTotal.toFixed(2)}\n`;
    textMessage += `=========================\n`;
    textMessage += `Please confirm availability and dispatch details. Thank you!`;

    const encodedText = encodeURIComponent(textMessage);
    const targetUrl = `https://wa.me{WHATSAPP_NUMBER}?text=${encodedText}`;

    window.open(targetUrl, '_blank');
}

// Initialize on page boot
window.onload = () => {
    renderProducts();
};
