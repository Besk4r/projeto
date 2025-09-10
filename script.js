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
            const response = await fetch('http://localhost:3000/configuracoes');
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
    function populateMenu() { /* ... (função existente e completa) */ }
    function populateStoreInfo() { /* ... (função existente e completa) */ }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    await fetchStoreConfig();
    populateStoreInfo();
    await fetchMenuData();
    populateMenu();

    // --- LÓGICA DO MODAL DO CARRINHO, FRETE, PAGAMENTO, ETC. ---
    // (Todo o resto do seu código de cliente continua aqui)
    // ...

    // --- LÓGICA DO MODO ADMIN ---
    function enterAdminMode() { isAdmin = true; populateMenu(); editStoreBtn.parentElement.classList.remove('hidden'); }

    // --- LÓGICA DO MODAL DE CONFIGURAÇÕES DA LOJA ---
    editStoreBtn.addEventListener('click', () => { /* ... (função existente) */ });
    cancelSettingsBtn.addEventListener('click', () => { storeSettingsModal.classList.add('hidden'); storeSettingsModal.classList.remove('flex'); });
    
    settingsForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const updatedConfig = { /* ... (dados do formulário) */ };
        showLoader();
        try {
            const response = await fetch('http://localhost:3000/configuracoes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedConfig)
            });
            if (!response.ok) throw new Error("Falha ao salvar as configurações.");
            storeConfig = updatedConfig;
            populateStoreInfo();
            storeSettingsModal.classList.add('hidden');
            storeSettingsModal.classList.remove('flex');
            Toastify({ text: "Configurações salvas com sucesso!", style: { background: "#16a34a" } }).showToast();
        } catch(error) {
            console.error(error);
            Toastify({ text: "Erro ao salvar as configurações.", style: { background: "#ef4444" } }).showToast();
        } finally {
            hideLoader();
        }
    });

    // --- LÓGICA DOS BOTÕES DE ADIÇÃO/EDIÇÃO/EXCLUSÃO DO ADMIN ---
    document.body.addEventListener("click", async function(event) {
        // (Lógica para Adicionar e Editar Itens)
        if (event.target.classList.contains("delete-item-btn")) {
            const card = event.target.closest(".product-card");
            const itemId = card.getAttribute("data-id");
            const itemName = card.querySelector(".font-bold").textContent;
            if (confirm(`Tem certeza que deseja excluir o item "${itemName}"?`)) {
                showLoader();
                try {
                    const response = await fetch(`http://localhost:3000/cardapio/${itemId}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Falha ao excluir o item.');
                    await fetchMenuData();
                    populateMenu();
                    Toastify({ text: "Item excluído com sucesso!", style: { background: "#16a34a" } }).showToast();
                } catch (error) {
                    console.error(error);
                    Toastify({ text: "Erro ao excluir o item.", style: { background: "#ef4444" } }).showToast();
                } finally {
                    hideLoader();
                }
            }
        }
    });
    
    itemForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        // (Lógica para obter os dados do formulário)
        const itemData = { /* ... */ };
        showLoader();
        try {
            const response = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(itemData) });
            if (!response.ok) throw new Error('Falha ao salvar o item.');
            await fetchMenuData();
            populateMenu();
            addEditModal.classList.add("hidden");
            addEditModal.classList.remove("flex");
            Toastify({ text: "Item salvo com sucesso!", style: { background: "#16a34a" } }).showToast();
        } catch (error) {
            console.error(error);
            Toastify({ text: "Erro ao salvar o item.", style: { background: "#ef4444" } }).showToast();
        } finally {
            hideLoader();
        }
    });

    // --- O RESTO DO SEU CÓDIGO JS, QUE NÃO FOI ABREVIADO, CONTINUA AQUI ---

}); // Fim do DOMContentLoaded

