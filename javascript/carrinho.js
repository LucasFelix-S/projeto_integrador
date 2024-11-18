// Tornar as funções globais
window.registerUser = registerUser;
window.loginUser = loginUser;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.finalizarCompra = finalizarCompra;
window.toggleCart = toggleCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;

const cart = [];

// Base URL do backend
const BASE_URL = 'http://127.0.0.1:5000';

// Função para registrar usuário
async function registerUser() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`${BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha }),
        });

        const result = await response.json();
        if (response.status === 201) {
            alert(result.message);
            window.location.href = "../templates/index.html"; // Redirecionar para a página de login
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error("Erro ao registrar:", error);
    }
}

// Função para login
async function loginUser() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try {
        const response = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        const result = await response.json();
        if (response.status === 200) {
            alert(result.message);
            window.location.href = "../templates/catalogo.html"; // Redirecionar para o catálogo
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
    }
}

// Adicionar item ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}

// Atualizar itens do carrinho
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

// Remover item do carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Finalizar compra
function finalizarCompra() {
    const confirmation = confirm("Compra finalizada! Obrigado pela preferência.");
    if (confirmation) {
        window.location.href = "final.html";
    }
}

// Alternar exibição do carrinho
function toggleCart() {
    const cartContainer = document.getElementById("cart-container");
    if (cartContainer.style.display === "none" || cartContainer.style.display === "") {
        cartContainer.style.display = "block";
    } else {
        cartContainer.style.display = "none";
    }
}

// Aumentar quantidade de itens
function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCart();
}

// Diminuir quantidade de itens
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeFromCart(index);
    }
    updateCart();
}
