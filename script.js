// Aguarda o HTML ser totalmente carregado para então executar o JavaScript
document.addEventListener('DOMContentLoaded', function() {

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const menu = document.getElementById("menu");
    const cartBtn = document.getElementById("cart-btn");
    const cartModal = document.getElementById("modal-cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const cartCounter = document.getElementById("cart-count");
    const addressInput = document.getElementById("address");
    const addressWarn = document.getElementById("address-warn");
    const dateSpan = document.getElementById("date-span");
    const deliveryOptions = document.querySelectorAll('input[name="deliveryOption"]');
    const addressContainer = document.getElementById("address-container");
    const paymentOptions = document.querySelectorAll('input[name="paymentOption"]');
    const changeContainer = document.getElementById("change-container");
    const changeInput = document.getElementById("change");
    const pixModal = document.getElementById("pix-modal");
    const pixKeySpan = document.getElementById("pix-key");
    const copyPixBtn = document.getElementById("copy-pix-btn");
    const sendReceiptBtn = document.getElementById("send-receipt-btn");
    const pixTotal = document.getElementById("pix-total");
    const moreInfoBtn = document.getElementById("more-info-btn");
    const infoModal = document.getElementById("info-modal");
    const closeInfoModalBtn = document.getElementById("close-info-modal-btn");
    const infoTabs = document.querySelectorAll("#info-tabs .tab-link");
    const infoTabContents = document.querySelectorAll("#info-modal .tab-content");
    const cepInput = document.getElementById("cep-input");
    const calculateShippingBtn = document.getElementById("calculate-shipping-btn");
    const shippingFeeText = document.getElementById("shipping-fee");
    const shippingContainer = document.getElementById("shipping-container");
    
    // --- VARIÁVEIS GLOBAIS ---
    let cart = [];
    let shippingRate = 0;

    // --- ⚠️ ATENÇÃO: TABELA DE FRETES (PERSONALIZÁVEL) ---
    const shippingRates = {
        "75110": 5.00,
        "75113": 7.00,
        "75000": 10.00,
    };
    
    // --- LÓGICA DO MODAL DO CARRINHO ---
    cartBtn.addEventListener("click", function () {
        updateCartModal();
        cartModal.classList.remove("hidden");
        cartModal.classList.add("flex");
    });

    cartModal.addEventListener("click", function (event) {
        if (event.target === cartModal) {
            cartModal.classList.add("hidden");
            cartModal.classList.remove("flex");
        }
    });

    closeModalBtn.addEventListener("click", function () {
        cartModal.classList.add("hidden");
        cartModal.classList.remove("flex");
    });

    // --- LÓGICA DO CARRINHO ---
    menu.addEventListener("click", function (event) {
        let parentButton = event.target.closest(".add-to-cart-btn");
        if (parentButton) {
            const name = parentButton.getAttribute("data-name");
            const price = parseFloat(parentButton.getAttribute("data-price"));
            addToCart(name, price);
        }
    });

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCartModal();
        animateCartCounter(); // <<-- CHAMA A ANIMAÇÃO AQUI
    }

    cartItemsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-from-cart-btn")) {
            const name = event.target.getAttribute("data-name");
            removeItemCart(name);
        }
    });

    function removeItemCart(name) {
        const index = cart.findIndex(item => item.name === name);
        if (index !== -1) {
            const item = cart[index];
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCartModal();
        }
    }

    // --- ATUALIZAÇÃO DA INTERFACE DO CARRINHO ---
    function updateCartModal() {
        cartItemsContainer.innerHTML = "";
        let subtotal = 0;
        let totalItems = 0;
        cart.forEach(item => {
            const itemEl = document.createElement("div");
            itemEl.classList.add("flex", "justify-between", "mb-4");
            itemEl.innerHTML = `
                <div class="flex items-center justify-between w-full">
                    <div>
                        <p class="font-bold">${item.name}</p>
                        <p>Qtd: ${item.quantity}</p>
                        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-from-cart-btn text-red-500" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            `;
            subtotal += item.price * item.quantity;
            totalItems += item.quantity;
            cartItemsContainer.appendChild(itemEl);
        });
        const total = subtotal + shippingRate;
        cartTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        cartCounter.innerText = totalItems;
    }

    // --- NOVA FUNÇÃO PARA ANIMAR O CONTADOR ---
    function animateCartCounter() {
        cartCounter.classList.add('cart-animation');
        setTimeout(() => {
            cartCounter.classList.remove('cart-animation');
        }, 300); // Duração da animação em milissegundos
    }

    // --- LÓGICA DAS OPÇÕES DE PAGAMENTO, ENTREGA E FRETE ---
    deliveryOptions.forEach(option => {
        option.addEventListener("change", (event) => {
            if (event.target.value === "delivery") {
                addressContainer.classList.remove("hidden");
                shippingContainer.classList.remove("hidden");
            } else {
                addressContainer.classList.add("hidden");
                shippingContainer.classList.add("hidden");
                addressInput.value = "";
                shippingRate = 0;
                shippingFeeText.innerHTML = "";
                cepInput.value = "";
                updateCartModal();
            }
        });
    });

    calculateShippingBtn.addEventListener("click", function() {
        const cep = cepInput.value;
        if (!cep) return;
        const cepPrefix = cep.substring(0, 5);
        if (shippingRates[cepPrefix] !== undefined) {
            shippingRate = shippingRates[cepPrefix];
            shippingFeeText.innerHTML = `Frete: ${shippingRate.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} <i class="fas fa-check-circle text-green-500"></i>`;
        } else {
            shippingRate = 0;
            shippingFeeText.innerHTML = `Frete: <span class="text-red-500">Não entregamos neste CEP</span>`;
        }
        updateCartModal();
    });

    paymentOptions.forEach(option => {
        option.addEventListener("change", (event) => {
            if (event.target.value === "dinheiro") {
                changeContainer.classList.remove("hidden");
            } else {
                changeContainer.classList.add("hidden");
                changeInput.value = "";
            }
        });
    });

    addressInput.addEventListener("input", (event) => {
        if (event.target.value !== "") {
            addressInput.classList.remove("border-red-500");
            addressWarn.classList.add("hidden");
        }
    });

    // --- LÓGICA DE FINALIZAÇÃO DO PEDIDO ---
    checkoutBtn.addEventListener("click", () => {
        if (!checkRestaurantStatus()) {
            alert("DESCULPE, O RESTAURANTE ESTÁ FECHADO!");
            return;
        }
        if (cart.length === 0) return;
        const delivery = document.querySelector('input[name="deliveryOption"]:checked').value;
        if (delivery === "delivery" && addressInput.value === "") {
            addressWarn.classList.remove("hidden");
            addressInput.classList.add("border-red-500");
            return;
        }
        const payment = document.querySelector('input[name="paymentOption"]:checked').value;
        if (payment === "pix") {
            const totalPedido = cart.reduce((total, item) => total + (item.price * item.quantity), 0) + shippingRate;
            pixTotal.textContent = totalPedido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            cartModal.classList.add("hidden");
            pixModal.classList.remove("hidden");
            pixModal.classList.add("flex");
            return;
        }
        sendOrderToWhatsApp();
    });

    copyPixBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(pixKeySpan.textContent);
        copyPixBtn.textContent = "Copiado!";
        setTimeout(() => { copyPixBtn.textContent = "Copiar"; }, 2000);
    });

    sendReceiptBtn.addEventListener("click", () => sendOrderToWhatsApp("PIX"));

    function sendOrderToWhatsApp(paymentFromPix = null) {
        const items = cart.map(item => ` ${item.name} | Qtd: (${item.quantity}) | Preço: R$${item.price.toFixed(2)}\n`).join("");
        const subtotal = cart.reduce((t, item) => t + (item.price * item.quantity), 0);
        const total = subtotal + shippingRate;
        let message = `*NOVO PEDIDO:*\n\n${items}\n`;
        message += `*Subtotal:* ${subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
        const deliveryMethod = document.querySelector('input[name="deliveryOption"]:checked').value;
        if (deliveryMethod === "delivery") { message += `*Frete:* ${shippingRate.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`; }
        message += `*Total do Pedido:* ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n\n`;
        let paymentMethod = paymentFromPix || document.querySelector('input[name="paymentOption"]:checked').value;
        message += `*Forma de Pagamento:* ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}\n`;
        if (paymentMethod === "dinheiro" && changeInput.value !== "") { message += `*Troco para:* R$ ${changeInput.value}\n`; }
        message += (deliveryMethod === "delivery") ? `\n*Endereço de entrega:* ${addressInput.value}` : `\n*Tipo de entrega:* Retirada no local`;
        const phone = "SEUNUMERODOTELEFONE";
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
        cart = [];
        shippingRate = 0;
        cepInput.value = "";
        shippingFeeText.innerHTML = "";
        updateCartModal();
        cartModal.classList.add("hidden");
        pixModal.classList.add("hidden");
    }

    // --- VERIFICAR HORÁRIO DE FUNCIONAMENTO ---
    function checkRestaurantStatus() {
        const data = new Date();
        const hora = data.getHours();
        return hora >= 18 && hora < 22;
        // return true; // Descomente para desabilitar a verificação durante os testes
    }

    const isOpen = checkRestaurantStatus();
    if (isOpen) {
        dateSpan.classList.remove("bg-red-500");
        dateSpan.classList.add("bg-green-600");
    } else {
        dateSpan.classList.remove("bg-green-600");
        dateSpan.classList.add("bg-red-500");
    }
    
    // --- LÓGICA DO MODAL DE INFORMAÇÕES E ABAS ---
    moreInfoBtn.addEventListener("click", () => {
        infoModal.classList.remove("hidden");
        infoModal.classList.add("flex");
    });
    closeInfoModalBtn.addEventListener("click", () => {
        infoModal.classList.add("hidden");
        infoModal.classList.remove("flex");
    });
    infoModal.addEventListener("click", (event) => {
        if (event.target === infoModal) {
            infoModal.classList.add("hidden");
            infoModal.classList.remove("flex");
        }
    });
    infoTabs.forEach(tab => {
        tab.addEventListener("click", (event) => {
            event.preventDefault();
            infoTabs.forEach(t => {
                t.classList.remove("border-red-500", "text-red-500");
                t.classList.add("text-gray-500");
            });
            tab.classList.add("border-red-500", "text-red-500");
            infoTabContents.forEach(content => {
                content.classList.add("hidden");
            });
            const tabId = tab.getAttribute("data-tab");
            document.getElementById(`tab-content-${tabId}`).classList.remove("hidden");
        });
    });

}); // Fim do DOMContentLoaded