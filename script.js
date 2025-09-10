// Aguarda o HTML ser totalmente carregado para então executar o JavaScript
document.addEventListener('DOMContentLoaded', async function() {

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const loader = document.getElementById("loader");
    const menu = document.getElementById("menu");
    const menuLanches = document.getElementById("menu-lanches");
    const menuBebidas = document.getElementById("menu-bebidas");
    const menuSobremesas = document.getElementById("menu-sobremesas");
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
    const adminLoginBtn = document.getElementById("admin-login-btn");
    const adminLoginModal = document.getElementById("admin-login-modal");
    const adminCloseModalBtn = document.getElementById("close-login-modal-btn");
    const loginBtn = document.getElementById("login-btn");
    const logoutContainer = document.getElementById("logout-container");
    const logoutBtn = document.getElementById("logout-btn");
    const addEditModal = document.getElementById("add-edit-modal");
    const modalTitle = document.getElementById("modal-title");
    const itemForm = document.getElementById("item-form");
    const cancelItemBtn = document.getElementById("cancel-item-btn");
    const settingsForm = document.getElementById("settings-form");
    const cancelSettingsBtn = document.getElementById("cancel-settings-btn");
    const editStoreBtn = document.getElementById("edit-store-btn");
    const storeSettingsModal = document.getElementById("store-settings-modal");
    const settingsNameInput = document.getElementById("settings-name-input");
    const settingsAddressInput = document.getElementById("settings-address-input");
    const settingsPhoneInput = document.getElementById("settings-phone-input");
    const settingsInstagramInput = document.getElementById("settings-instagram-input");
    const settingsCnpjInput = document.getElementById("settings-cnpj-input");
    const itemIdInput = document.getElementById("item-index-input");
    const itemNameInput = document.getElementById("item-name-input");
    const itemDescriptionInput = document.getElementById("item-description-input");
    const itemImageInput = document.getElementById("item-image-input");
    const itemPriceInput = document.getElementById("item-price-input");
    const itemCategorySelect = document.getElementById("item-category-select");

    // --- VARIÁVEIS GLOBAIS ---
    let menuData = [];
    let cart = [];
    let shippingRate = 0;
    let isAdmin = false;
    let storeConfig = {};

    // --- TABELA DE FRETES ---
    const shippingRates = { "75110": 5.00, "75113": 7.00, "75000": 10.00 };

    // --- FUNÇÕES DE CONTROLO DO SPINNER ---
    function showLoader() { loader.classList.remove("hidden"); loader.classList.add("flex"); }
    function hideLoader() { loader.classList.add("hidden"); loader.classList.remove("flex"); }
    
    // --- FUNÇÕES DE BUSCA DE DADOS (API) ---
    async function fetchMenuData() {
        showLoader();
        try {
            const response = await fetch('/api/cardapio');
            if (!response.ok) throw new Error('Erro ao carregar o cardápio.');
            menuData = await response.json();
        } catch (error) {
            console.error(error);
            Toastify({ text: "Erro ao carregar o cardápio.", style: { background: "#ef4444" } }).showToast();
        } finally {
            hideLoader();
        }
    }

    async function fetchStoreConfig() {
        showLoader();
        try {
            const response = await fetch('/api/configuracoes');
            if (!response.ok) throw new Error('Erro ao carregar as configurações da loja.');
            storeConfig = await response.json();
        } catch (error) {
            console.error(error);
            Toastify({ text: "Erro ao carregar as configurações da loja.", style: { background: "#ef4444" } }).showToast();
        } finally {
            hideLoader();
        }
    }

    // --- FUNÇÕES DE POPULAÇÃO DE DADOS NO HTML ---
    function populateMenu() {
        menuLanches.innerHTML = '';
        menuBebidas.innerHTML = '';
        menuSobremesas.innerHTML = '';
        menuData.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("flex", "gap-2", "product-card");
            card.setAttribute('data-id', item.id);
            const adminButtonsHTML = isAdmin ? `<div class="flex gap-2 mt-2"><button class="edit-item-btn bg-blue-500 text-white px-3 py-1 rounded text-sm">Editar</button><button class="delete-item-btn bg-red-500 text-white px-3 py-1 rounded text-sm">Excluir</button></div>` : '';
            card.innerHTML = `<img src="${item.image}" alt="${item.name}" class="w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration-300"/><div class="flex-1"><p class="font-bold">${item.name}</p><p class="text-sm">${item.description}</p><div class="flex items-center gap-2 justify-between mt-3"><p class="font-bold text-lg">R$ ${item.price.toFixed(2).replace('.', ',')}</p><button class="bg-gray-900 px-5 rounded add-to-cart-btn" data-name="${item.name}" data-price="${item.price}"><i class="fa fa-cart-plus text-lg text-white"></i></button></div>${adminButtonsHTML}</div>`;
            if (item.category === 'lanche') menuLanches.appendChild(card);
            else if (item.category === 'bebida') menuBebidas.appendChild(card);
            else if (item.category === 'sobremesa') menuSobremesas.appendChild(card);
        });
    }

    function populateStoreInfo() {
        document.getElementById("store-name-header").textContent = storeConfig.nome;
        document.getElementById("store-address-header").textContent = storeConfig.endereco;
        document.getElementById("store-name-info").textContent = storeConfig.nome;
        document.getElementById("store-instagram-info").textContent = storeConfig.instagram;
        document.getElementById("store-instagram-info").href = `https://www.instagram.com/${storeConfig.instagram.substring(1)}`;
        document.getElementById("store-whatsapp-info").textContent = storeConfig.telefone;
        document.getElementById("store-whatsapp-info").href = `https://wa.me/55${storeConfig.telefone.replace(/[^0-9]/g, '')}`;
        document.getElementById("store-phone-info").textContent = storeConfig.telefone;
        document.getElementById("store-phone-info").href = `tel:${storeConfig.telefone.replace(/[^0-9]/g, '')}`;
        document.getElementById("store-address-info").textContent = storeConfig.endereco;
        document.getElementById("store-name-footer").textContent = storeConfig.nome;
        document.getElementById("store-cnpj-footer").textContent = `CNPJ: ${storeConfig.cnpj}`;
        document.getElementById("store-address-footer").textContent = storeConfig.endereco;
        document.getElementById("store-phone-footer").textContent = `Telefone: ${storeConfig.telefone}`;
    }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    await fetchStoreConfig();
    populateStoreInfo();
    await fetchMenuData();
    populateMenu();

    // --- LÓGICA DO MODAL DO CARRINHO ---
    cartBtn.addEventListener("click", () => { updateCartModal(); cartModal.classList.remove("hidden"); cartModal.classList.add("flex"); });
    cartModal.addEventListener("click", (e) => { if(e.target === cartModal) { cartModal.classList.add("hidden"); cartModal.classList.remove("flex"); } });
    closeModalBtn.addEventListener("click", () => { cartModal.classList.add("hidden"); cartModal.classList.remove("flex"); });

    // --- LÓGICA DO CARRINHO ---
    menu.addEventListener("click", (e) => { let parentButton = e.target.closest(".add-to-cart-btn"); if (parentButton) { addToCart(parentButton.getAttribute("data-name"), parseFloat(parentButton.getAttribute("data-price"))); } });
    function addToCart(name, price) { const existingItem = cart.find(item => item.name === name); if(existingItem){ existingItem.quantity++; } else { cart.push({name, price, quantity: 1}); } updateCartModal(); animateCartCounter(); Toastify({ text: "Item adicionado!", duration: 3000, gravity: "top", position: "right", style: { background: "#16a34a" } }).showToast(); }
    cartItemsContainer.addEventListener("click", (e) => { if(e.target.classList.contains("remove-from-cart-btn")) { removeItemCart(e.target.getAttribute("data-name")); } });
    function removeItemCart(name) { const index = cart.findIndex(item => item.name === name); if(index !== -1) { const item = cart[index]; if(item.quantity > 1){ item.quantity--; } else { cart.splice(index, 1); } updateCartModal(); } }

    // --- ATUALIZAÇÃO DA INTERFACE DO CARRINHO E ANIMAÇÃO ---
    function updateCartModal() { cartItemsContainer.innerHTML = ""; let subtotal = 0; let totalItems = 0; cart.forEach(item => { const itemEl = document.createElement("div"); itemEl.classList.add("flex", "justify-between", "mb-4"); itemEl.innerHTML = `<div class="flex items-center justify-between w-full"><div><p class="font-bold">${item.name}</p><p>Qtd: ${item.quantity}</p><p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p></div><button class="remove-from-cart-btn text-red-500" data-name="${item.name}">Remover</button></div>`; subtotal += item.price * item.quantity; totalItems += item.quantity; cartItemsContainer.appendChild(itemEl); }); const total = subtotal + shippingRate; cartTotal.textContent = total.toLocaleString("pt-BR", {style: "currency", currency: "BRL"}); cartCounter.innerText = totalItems; }
    function animateCartCounter() { cartCounter.classList.add('cart-animation'); setTimeout(() => { cartCounter.classList.remove('cart-animation'); }, 300); }

    // --- LÓGICA DAS OPÇÕES DE PAGAMENTO, ENTREGA E FRETE ---
    deliveryOptions.forEach(o => o.addEventListener("change", (e) => { if(e.target.value === "delivery") { addressContainer.classList.remove("hidden"); shippingContainer.classList.remove("hidden"); } else { addressContainer.classList.add("hidden"); shippingContainer.classList.add("hidden"); addressInput.value = ""; shippingRate = 0; shippingFeeText.innerHTML = ""; cepInput.value = ""; updateCartModal(); } }));
    calculateShippingBtn.addEventListener("click", () => { const cep = cepInput.value; if(!cep) return; const cepPrefix = cep.substring(0, 5); if(shippingRates[cepPrefix] !== undefined) { shippingRate = shippingRates[cepPrefix]; shippingFeeText.innerHTML = `Frete: ${shippingRate.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} <i class="fas fa-check-circle text-green-500"></i>`; } else { shippingRate = 0; shippingFeeText.innerHTML = `Frete: <span class="text-red-500">Não entregamos neste CEP</span>`; } updateCartModal(); });
    paymentOptions.forEach(o => o.addEventListener("change", (e) => { if(e.target.value === "dinheiro") { changeContainer.classList.remove("hidden"); } else { changeContainer.classList.add("hidden"); changeInput.value = ""; } }));
    addressInput.addEventListener("input", (e) => { if (e.target.value !== "") { addressInput.classList.remove("border-red-500"); addressWarn.classList.add("hidden"); } });

    // --- LÓGICA DE FINALIZAÇÃO DO PEDIDO ---
    checkoutBtn.addEventListener("click", () => { if(!checkRestaurantStatus()){ Toastify({ text: "DESCULPE, O RESTAURANTE ESTÁ FECHADO!", duration: 3000, gravity: "top", position: "right", style: { background: "#ef4444" } }).showToast(); return; } if(cart.length === 0) return; const delivery = document.querySelector('input[name="deliveryOption"]:checked').value; if(delivery === "delivery" && addressInput.value === "") { addressWarn.classList.remove("hidden"); addressInput.classList.add("border-red-500"); return; } const payment = document.querySelector('input[name="paymentOption"]:checked').value; if(payment === "pix"){ const totalPedido = cart.reduce((total, item) => total + (item.price * item.quantity), 0) + shippingRate; pixTotal.textContent = totalPedido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); cartModal.classList.add("hidden"); cartModal.classList.remove("flex"); pixModal.classList.remove("hidden"); pixModal.classList.add("flex"); return; } sendOrderToWhatsApp(); });
    copyPixBtn.addEventListener("click", () => { navigator.clipboard.writeText(pixKeySpan.textContent); Toastify({ text: "Chave PIX copiada!", duration: 2000, gravity: "top", position: "right", style: { background: "#16a34a" } }).showToast(); });
    sendReceiptBtn.addEventListener("click", () => sendOrderToWhatsApp("PIX"));
    function sendOrderToWhatsApp(paymentFromPix = null) { const items = cart.map(item => ` ${item.name} | Qtd: (${item.quantity}) | Preço: R$${item.price.toFixed(2)}\n`).join(""); const subtotal = cart.reduce((t, item) => t + (item.price * item.quantity), 0); const total = subtotal + shippingRate; let message = `*NOVO PEDIDO:*\n\n${items}\n`; message += `*Subtotal:* ${subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`; const deliveryMethod = document.querySelector('input[name="deliveryOption"]:checked').value; if(deliveryMethod === "delivery") { message += `*Frete:* ${shippingRate.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`; } message += `*Total do Pedido:* ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n\n`; let paymentMethod = paymentFromPix || document.querySelector('input[name="paymentOption"]:checked').value; message += `*Forma de Pagamento:* ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}\n`; if(paymentMethod === "dinheiro" && changeInput.value !== "") { message += `*Troco para:* R$ ${changeInput.value}\n`; } message += (deliveryMethod === "delivery") ? `\n*Endereço de entrega:* ${addressInput.value}` : `\n*Tipo de entrega:* Retirada no local`; const phone = "SEUNUMERODOTELEFONE"; window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank"); cart = []; shippingRate = 0; cepInput.value = ""; shippingFeeText.innerHTML = ""; updateCartModal(); cartModal.classList.add("hidden"); cartModal.classList.remove("flex"); pixModal.classList.add("hidden"); pixModal.classList.remove("flex"); }

    // --- VERIFICAR HORÁRIO DE FUNCIONAMENTO ---
    function checkRestaurantStatus() { const data = new Date(); const hora = data.getHours(); return hora >= 18 && hora < 22; }
    const isOpen = checkRestaurantStatus(); if(isOpen){ dateSpan.classList.remove("bg-red-500"); dateSpan.classList.add("bg-green-600"); } else { dateSpan.classList.remove("bg-green-600"); dateSpan.classList.add("bg-red-500"); }
    
    // --- LÓGICA DO MODAL DE INFORMAÇÕES E ABAS ---
    moreInfoBtn.addEventListener("click", () => { infoModal.classList.remove("hidden"); infoModal.classList.add("flex"); });
    closeInfoModalBtn.addEventListener("click", () => { infoModal.classList.add("hidden"); infoModal.classList.remove("flex"); });
    infoModal.addEventListener("click", (e) => { if(e.target === infoModal) { infoModal.classList.add("hidden"); infoModal.classList.remove("flex"); } });
    infoTabs.forEach(tab => { tab.addEventListener("click", (e) => { e.preventDefault(); infoTabs.forEach(t => { t.classList.remove("border-red-500", "text-red-500"); t.classList.add("text-gray-500"); }); tab.classList.add("border-red-500", "text-red-500"); infoTabContents.forEach(c => c.classList.add("hidden")); document.getElementById(`tab-content-${tab.getAttribute("data-tab")}`).classList.remove("hidden"); }); });
    
    // --- LÓGICA DO MODAL DE LOGIN ADM ---
    adminLoginBtn.addEventListener("click", () => { adminLoginModal.classList.remove("hidden"); adminLoginModal.classList.add("flex"); });
    adminCloseModalBtn.addEventListener("click", () => { adminLoginModal.classList.add("hidden"); adminLoginModal.classList.remove("flex"); });
    logoutBtn.addEventListener("click", () => { window.location.reload(); });
    loginBtn.addEventListener("click", () => { const user = "admin"; const pass = "1234"; const userInput = document.getElementById("admin-user-input").value; const passInput = document.getElementById("admin-password-input").value; if (user === userInput && pass === passInput) { Toastify({ text: "Login efetuado com sucesso!", style: { background: "#16a34a" } }).showToast(); isAdmin = true; adminLoginBtn.classList.add("hidden"); logoutContainer.classList.remove("hidden"); enterAdminMode(); adminLoginModal.classList.add("hidden"); adminLoginModal.classList.remove("flex"); } else { Toastify({ text: "Usuário ou senha inválidos!", style: { background: "#ef4444" } }).showToast(); } document.getElementById("admin-user-input").value = ""; document.getElementById("admin-password-input").value = ""; });
    
    // --- FUNÇÕES DO MODO ADMIN ---
    function enterAdminMode() { isAdmin = true; populateMenu(); if (!document.getElementById("add-lanche-btn")) { menuLanches.insertAdjacentHTML('afterend', `<button id="add-lanche-btn" class="w-full bg-green-500 text-white py-2 rounded-lg my-4 font-bold">+ Adicionar Novo Lanche</button>`); } if (!document.getElementById("add-bebida-btn")) { menuBebidas.insertAdjacentHTML('afterend', `<button id="add-bebida-btn" class="w-full bg-green-500 text-white py-2 rounded-lg my-4 font-bold">+ Adicionar Nova Bebida</button>`); } if (!document.getElementById("add-sobremesa-btn")) { menuSobremesas.insertAdjacentHTML('afterend', `<button id="add-sobremesa-btn" class="w-full bg-green-500 text-white py-2 rounded-lg my-4 font-bold">+ Adicionar Nova Sobremesa</button>`); } }
    
    // --- LÓGICA DOS MODAIS DE ADMIN ---
    document.body.addEventListener("click", async function(event) {
        if (event.target.id === "add-lanche-btn" || event.target.id === "add-bebida-btn" || event.target.id === "add-sobremesa-btn") { modalTitle.textContent = "Adicionar Novo Item"; itemIdInput.value = ""; itemForm.reset(); addEditModal.classList.remove("hidden"); addEditModal.classList.add("flex"); }
        if (event.target.classList.contains("edit-item-btn")) { const card = event.target.closest(".product-card"); const itemId = card.getAttribute("data-id"); const itemToEdit = menuData.find(item => item.id === itemId); itemNameInput.value = itemToEdit.name; itemDescriptionInput.value = itemToEdit.description; itemPriceInput.value = itemToEdit.price; itemImageInput.value = itemToEdit.image; itemCategorySelect.value = itemToEdit.category; itemIdInput.value = itemId; modalTitle.textContent = "Editar Item"; addEditModal.classList.remove("hidden"); addEditModal.classList.add("flex"); }
        if (event.target.classList.contains("delete-item-btn")) { const card = event.target.closest(".product-card"); const itemId = card.getAttribute("data-id"); const itemName = card.querySelector(".font-bold").textContent; if (confirm(`Tem certeza que deseja excluir o item "${itemName}"?`)) { showLoader(); try { const response = await fetch(`/api/cardapio/${itemId}`, { method: 'DELETE' }); if (!response.ok) throw new Error('Falha ao excluir o item.'); await fetchMenuData(); populateMenu(); Toastify({ text: "Item excluído com sucesso!", style: { background: "#16a34a" } }).showToast(); } catch (error) { console.error(error); Toastify({ text: "Erro ao excluir o item.", style: { background: "#ef4444" } }).showToast(); } finally { hideLoader(); } } }
    });
    
    cancelItemBtn.addEventListener("click", () => { addEditModal.classList.add("hidden"); addEditModal.classList.remove("flex"); });
    itemForm.addEventListener("submit", async (event) => { event.preventDefault(); const itemId = itemIdInput.value; const itemData = { name: itemNameInput.value, description: itemDescriptionInput.value, price: parseFloat(itemPriceInput.value), image: itemImageInput.value, category: itemCategorySelect.value }; const isNewItem = itemId === ""; const url = isNewItem ? '/api/cardapio' : `/api/cardapio/${itemId}`; const method = isNewItem ? 'POST' : 'PUT'; showLoader(); try { const response = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(itemData) }); if (!response.ok) throw new Error('Falha ao salvar o item.'); await fetchMenuData(); populateMenu(); addEditModal.classList.add("hidden"); addEditModal.classList.remove("flex"); Toastify({ text: "Item salvo com sucesso!", style: { background: "#16a34a" } }).showToast(); } catch (error) { console.error(error); Toastify({ text: "Erro ao salvar o item.", style: { background: "#ef4444" } }).showToast(); } finally { hideLoader(); } });

    editStoreBtn.addEventListener('click', () => { settingsNameInput.value = storeConfig.nome; settingsAddressInput.value = storeConfig.endereco; settingsPhoneInput.value = storeConfig.telefone; settingsInstagramInput.value = storeConfig.instagram; settingsCnpjInput.value = storeConfig.cnpj; storeSettingsModal.classList.remove('hidden'); storeSettingsModal.classList.add('flex'); });
    cancelSettingsBtn.addEventListener('click', () => { storeSettingsModal.classList.add('hidden'); storeSettingsModal.classList.remove('flex'); });
    settingsForm.addEventListener('submit', async (event) => { event.preventDefault(); const updatedConfig = { nome: settingsNameInput.value, endereco: settingsAddressInput.value, telefone: settingsPhoneInput.value, instagram: settingsInstagramInput.value, cnpj: settingsCnpjInput.value }; showLoader(); try { const response = await fetch('/api/configuracoes', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedConfig) }); if (!response.ok) throw new Error("Falha ao salvar as configurações."); storeConfig = updatedConfig; populateStoreInfo(); storeSettingsModal.classList.add('hidden'); storeSettingsModal.classList.remove('flex'); Toastify({ text: "Configurações salvas com sucesso!", style: { background: "#16a34a" } }).showToast(); } catch(error) { console.error(error); Toastify({ text: "Erro ao salvar as configurações.", style: { background: "#ef4444" } }).showToast(); } finally { hideLoader(); } });

}); // Fim do DOMContentLoaded

