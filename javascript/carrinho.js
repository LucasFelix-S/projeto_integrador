window.registerUser = registerUser;
window.loginUser = loginUser;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.finalizarCompra = finalizarCompra;
window.toggleCart = toggleCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;

const cart = [];

function registerUser() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!nome || !email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioExistente = usuarios.find(usuario => usuario.email === email);
    if (usuarioExistente) {
        alert("Este e-mail já está registrado.");
        return;
    }

    usuarios.push({ nome, email, senha });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert("Usuário registrado com sucesso!");
    window.location.href = "index.html";
}

function loginUser() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuario = usuarios.find(usuario => usuario.email === email && usuario.senha === senha);

    if (usuario) {
        alert(`Bem-vindo(a), ${usuario.nome}!`);
        window.location.href = "catalogo.html";
    } else {
        alert("E-mail ou senha inválidos.");
    }
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
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
        cart.length = 0;
        updateCart();
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