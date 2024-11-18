window.registerUser = registerUser;
window.loginUser = loginUser;
const cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;
        cartItems.appendChild(div);
    });
    document.getElementById('cart').style.display = 'block';
}

function toggleCart() {
    const cartElement = document.getElementById('cart');
    cartElement.style.display = cartElement.style.display === 'block' ? 'none' : 'block';
}

function redirectToCatalog() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) { 
        window.location.href = "catalogo.html";
    } else {
        alert("Por favor, preencha o e-mail e a senha.");
    }
}

// Base URL do backend
const BASE_URL = 'https://oyster-app-gik5j.ondigitalocean.app';

// Função para registrar usuário
async function registerUser() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
    });

    const result = await response.json();
    if (response.status === 201) {
        alert(result.message);
        window.location.href = "index.html"; // Redirecionar para a página de login
    } else {
        alert(result.error);
    }
}

// Função para login
async function loginUser() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
    });

    const result = await response.json();

    if (response.status === 200) {
        alert(result.message);
        window.location.href = "catalogo.html"; // Redirecionar para o catálogo
    } else {
        alert(result.error);
    }
}

    const result = await response.json();

    if (response.status === 200) {
        window.location.href = "../catalogo.html";
    } else {
        alert(result.error);
    }


function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCart();

    const cartContainer = document.getElementById("cart-container");
    if (cartContainer.style.display === "none" || cartContainer.style.display === "") {
        toggleCart();
    }
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";

    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
            <div class="quantity-controls">
                <button class="decrease-btn" onclick="decreaseQuantity(${index})">-</button>
                <span>${item.quantity}</span>
                <button class="increase-btn" onclick="increaseQuantity(${index})">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">Remover</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.getElementById("cart-total").innerText = `Total: R$ ${cartTotal.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function finalizarCompra() {
    const confirmation = confirm("Compra finalizada! Obrigado pela preferência.");
    if (confirmation) {
        window.location.href = "final.html";
    }
}

function toggleCart() {
    const cartContainer = document.getElementById("cart-container");
    if (cartContainer.style.display === "none" || cartContainer.style.display === "") {
        cartContainer.style.display = "block";
    } else {
        cartContainer.style.display = "none";
    }
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeFromCart(index);
    }
    updateCart();
}