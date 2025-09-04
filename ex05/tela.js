// Dados do aplicativo DevLivery
let appState = {
    currentScreen: 'home-screen',
    cart: [],
    menuItems: [
        {
            id: 1,
            name: 'Tacacá',
            description: 'O clássico caldo de tucupi com jambu e camarão seco. Servido em cuia tradicional.',
            price: 15.99,
            image: 'https://i.pinimg.com/736x/4a/f4/95/4af495e0bcb3327c1acc08de8225ca3e.jpg',
            category: 'para'
        },
        {
            id: 2,
            name: 'Pato no Tucupi',
            description: 'Pato assado servido com molho de tucupi e jambu. Acompanha arroz e farinha.',
            price: 38.99,
            image: 'https://i.pinimg.com/1200x/95/25/77/95257784b6af03730ed86ecb7367997c.jpg',
            category: 'para'
        },
        {
            id: 3,
            name: 'Maniçoba',
            description: 'Prato tradicional preparado com folha de mandioca e carnes variadas.',
            price: 32.99,
            image: 'https://i.pinimg.com/1200x/b6/5f/2c/b65f2c4b10a93081501934b0ada89e35.jpg',
            category: 'para'
        },
        {
            id: 4,
            name: 'Caruru',
            description: 'Quiabo cozido com camarão seco, farinha e temperos especiais.',
            price: 26.99,
            image: 'https://i.pinimg.com/1200x/85/13/6b/85136bbee5edfd8a7759425ec6ce5549.jpg',
            category: 'para'
        },
        {
            id: 5,
            name: 'Açaí na Tigela',
            description: 'Açaí cremoso servido à moda paraense. Acompanha farinha de tapioca e camarão seco.',
            price: 18.99,
            image: 'https://i.pinimg.com/736x/2c/3e/2e/2c3e2e879de9b04810bd1451b059fd09.jpg',
            category: 'para'
        },
        {
            id: 6,
            name: 'Vatapá Especial',
            description: 'Creme à base de pão, camarão, amendoim e dendê. Tempero paraense autêntico.',
            price: 28.99,
            image: 'https://i.pinimg.com/736x/80/4d/7e/804d7e3a2107d754cccff9ed47729570.jpg',
            category: 'para'
        },
        {
            id: 7,
            name: 'Peixe Frito',
            description: 'Fíle de Dourada no caprixo com acompanhamento.',
            price: 18.99,
            image: 'https://i.pinimg.com/736x/1b/98/f1/1b98f1bb3dd2bf0aff0ec24f5aa041a6.jpg',
            category: 'para'
        },
        {
            id: 8,
            name: 'Caranguejo',
            description: 'Um prato com 4 Caranguejos mais Acompanhamento, tempero paraense autêntico',
            price: 24.99,
            image: 'https://i.pinimg.com/1200x/15/d4/17/15d417da6cc091ab12d978f46933190f.jpg',
            category: 'para'
        },
        {
            id: 9,
            name: 'Maracujá',
            description: 'Drink de Maracujá típico do Pará.',
            price: 8.99,
            image: 'https://i.pinimg.com/736x/68/b7/aa/68b7aa219f1e77c16a069774cfe2b79c.jpg',
            category: 'drinks'
        },
        {
            id: 10,
            name: 'Goiaba',
            description: 'Drink de Goiaba típico da Amazônia.',
            price: 8.99,
            image: 'https://i.pinimg.com/1200x/c8/68/84/c86884d8ce68f93cc572a0425b47b3ac.jpg',
            category: 'drinks'
        }
    ],
    categories: [
         { id: 'todos', name: 'Todos' },
         { id: 'para', name: 'Culinária Paraense' },
         
         { id: 'drinks', name: 'Bebidas' }
     ],
    selectedCategory: 'todos',
    orderInfo: {
        name: '',
        address: '',
        phone: '',
        paymentMethod: '',
        cardInfo: {
            number: '',
            name: '',
            expiry: '',
            cvv: ''
        },
        orderNumber: '',
        estimatedTime: ''
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados do localStorage se existirem
    loadFromLocalStorage();
    
    // Inicializar a navegação
    setupNavigation();
    
    // Renderizar o menu
    renderMenu();
    
    // Renderizar categorias
    renderCategories();
    
    // Atualizar o contador do carrinho
    updateCartCount();
    
    // Adicionar event listeners para os botões
    setupEventListeners();
    
    // Adicionar event listeners para os botões de navegação
    document.querySelectorAll('[data-navigate]').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetScreen = button.getAttribute('data-navigate');
            navigateTo(targetScreen);
        });
    });
});

// Funções de navegação
function setupNavigation() {
    // Adicionar event listeners para os links de navegação
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetScreen = link.getAttribute('data-screen') + '-screen';
            navigateTo(targetScreen);
        });
    });
    
    // Adicionar event listeners para os botões de navegação
    document.querySelectorAll('[data-navigate]').forEach(button => {
        // Adicionar efeito de ripple para feedback visual
        button.classList.add('ripple-effect');
        
        button.addEventListener('click', (e) => {
            // Criar efeito de ripple
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            // Remover o ripple após a animação
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            const targetScreen = button.getAttribute('data-navigate');
            console.log('Navegando para:', targetScreen);
            navigateTo(targetScreen);
        });
    });
    
    // Mostrar a tela inicial
    navigateTo(appState.currentScreen);
}

function navigateTo(screenId) {
    // Esconder todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar a tela selecionada
    document.getElementById(screenId).classList.add('active');
    
    // Atualizar o estado atual
    appState.currentScreen = screenId;
    
    // Atualizar a navegação ativa
    document.querySelectorAll('nav a').forEach(link => {
        const linkScreen = link.getAttribute('data-screen') + '-screen';
        if (linkScreen === screenId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Ações específicas para cada tela
    if (screenId === 'cart-screen') {
        renderCart();
    } else if (screenId === 'payment-screen') {
        renderOrderSummary();
    }
    
    // Salvar o estado no localStorage
    saveToLocalStorage();
    
    // Scroll para o topo
    window.scrollTo(0, 0);
}

// Funções do menu
function renderCategories() {
    const categoriesContainer = document.querySelector('.category-tabs');
    if (!categoriesContainer) return;
    
    categoriesContainer.innerHTML = '';
    
    appState.categories.forEach(category => {
        const categoryTab = document.createElement('button');
        categoryTab.className = 'category-tab';
        if (category.id === appState.selectedCategory) {
            categoryTab.classList.add('active');
        }
        categoryTab.setAttribute('data-category', category.id);
        categoryTab.textContent = category.name;
        
        categoryTab.addEventListener('click', () => {
            appState.selectedCategory = category.id;
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            categoryTab.classList.add('active');
            renderMenu();
        });
        
        categoriesContainer.appendChild(categoryTab);
    });
}

function renderMenu() {
    const menuContainer = document.querySelector('.menu-items');
    if (!menuContainer) return;
    
    menuContainer.innerHTML = '';
    
    const filteredItems = appState.selectedCategory === 'todos' 
        ? appState.menuItems 
        : appState.menuItems.filter(item => item.category === appState.selectedCategory);
    
    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        
        // Adiciona badge para pratos paraenses
        const badgeHtml = item.category === 'para' ? 
            `<div class="menu-item-badge">Típico do Pará</div>` : '';
            
        menuItem.innerHTML = `
            ${badgeHtml}
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="item-footer">
                    <span class="price">R$ ${item.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn ripple-effect" data-id="${item.id}">
                        <i class="fas fa-shopping-cart"></i> Adicionar
                    </button>
                </div>
            </div>
        `;
        
        // Adicionar animação de entrada
        menuItem.style.opacity = '0';
        menuItem.style.transform = 'translateY(20px)';
        menuItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        menuContainer.appendChild(menuItem);
        
        // Forçar reflow para aplicar a animação
        void menuItem.offsetWidth;
        
        // Aplicar animação de entrada
        menuItem.style.opacity = '1';
        menuItem.style.transform = 'translateY(0)';
    });
    
    // Adicionar event listeners para os botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            // Criar efeito de ripple
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            // Remover o ripple após a animação
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            const itemId = parseInt(button.getAttribute('data-id'));
            addToCart(itemId);
        });
    });
}

// Funções do carrinho
function addToCart(itemId) {
    const item = appState.menuItems.find(item => item.id === itemId);
    if (!item) return;
    
    const existingItem = appState.cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push({
            ...item,
            quantity: 1
        });
    }
    
    // Atualizar o contador do carrinho
    updateCartCount();
    
    // Salvar o estado no localStorage
    saveToLocalStorage();
    
    // Mostrar mensagem de sucesso
    showToast(`${item.name} adicionado ao carrinho!`, 'success');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    const totalItems = appState.cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.style.display = 'inline-block';
    } else {
        cartCount.style.display = 'none';
    }
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');
    const checkoutButton = document.querySelector('.checkout-btn');
    
    if (!cartItemsContainer || !cartSummaryContainer || !checkoutButton) return;
    
    if (appState.cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <p>Seu carrinho está vazio</p>
                <button class="primary-button" data-navigate="menu-screen">Ver Cardápio</button>
            </div>
        `;
        cartSummaryContainer.style.display = 'none';
        checkoutButton.disabled = true;
        
        // Adicionar event listener para o botão de navegação
        document.querySelector('.empty-cart-message button').addEventListener('click', (e) => {
            const targetScreen = e.target.getAttribute('data-navigate');
            navigateTo(targetScreen);
        });
        
        return;
    }
    
    cartSummaryContainer.style.display = 'block';
    checkoutButton.disabled = false;
    
    // Renderizar itens do carrinho
    cartItemsContainer.innerHTML = '';
    
    appState.cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Adicionar event listeners para os botões de quantidade
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.getAttribute('data-id'));
            decreaseQuantity(itemId);
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.getAttribute('data-id'));
            increaseQuantity(itemId);
        });
    });
    
    // Adicionar event listeners para os botões de remover
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
    
    // Atualizar o resumo do carrinho
    updateCartSummary();
}

function decreaseQuantity(itemId) {
    const item = appState.cart.find(item => item.id === itemId);
    if (!item) return;
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        removeFromCart(itemId);
        return;
    }
    
    // Atualizar o carrinho
    renderCart();
    updateCartCount();
    
    // Salvar o estado no localStorage
    saveToLocalStorage();
}

function increaseQuantity(itemId) {
    const item = appState.cart.find(item => item.id === itemId);
    if (!item) return;
    
    item.quantity += 1;
    
    // Atualizar o carrinho
    renderCart();
    updateCartCount();
    
    // Salvar o estado no localStorage
    saveToLocalStorage();
}

function removeFromCart(itemId) {
    appState.cart = appState.cart.filter(item => item.id !== itemId);
    
    // Atualizar o carrinho
    renderCart();
    updateCartCount();
    
    // Salvar o estado no localStorage
    saveToLocalStorage();
}

function updateCartSummary() {
    const summaryContainer = document.querySelector('.cart-summary');
    if (!summaryContainer) return;
    
    const subtotal = appState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + deliveryFee;
    
    summaryContainer.innerHTML = `
        <h3>Resumo do Pedido</h3>
        <div class="summary-row">
            <span>Subtotal</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Taxa de entrega</span>
            <span>R$ ${deliveryFee.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>R$ ${total.toFixed(2)}</span>
        </div>
    `;
}

// Funções de pagamento
function renderOrderSummary() {
    const orderSummaryContainer = document.querySelector('.order-summary');
    if (!orderSummaryContainer) return;
    
    const subtotal = appState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + deliveryFee;
    
    let itemsHtml = '';
    appState.cart.forEach(item => {
        itemsHtml += `
            <div class="summary-row">
                <span>${item.quantity}x ${item.name}</span>
                <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    orderSummaryContainer.innerHTML = `
        <h3>Resumo do Pedido</h3>
        ${itemsHtml}
        <div class="summary-row">
            <span>Subtotal</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Taxa de entrega</span>
            <span>R$ ${deliveryFee.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>R$ ${total.toFixed(2)}</span>
        </div>
    `;
    
    // Configurar os métodos de pagamento
    setupPaymentMethods();
}

function setupPaymentMethods() {
    const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
    const paymentForms = document.querySelectorAll('.payment-form');
    
    if (!paymentOptions.length || !paymentForms.length) return;
    
    // Esconder todos os formulários de pagamento
    paymentForms.forEach(form => {
        form.style.display = 'none';
    });
    
    // Mostrar o formulário do método selecionado
    paymentOptions.forEach(option => {
        option.addEventListener('change', () => {
            const method = option.value;
            appState.orderInfo.paymentMethod = method;
            
            paymentForms.forEach(form => {
                if (form.id === `${method}-form`) {
                    form.style.display = 'block';
                } else {
                    form.style.display = 'none';
                }
            });
        });
    });
    
    // Selecionar o primeiro método por padrão
    if (paymentOptions.length > 0 && !appState.orderInfo.paymentMethod) {
        paymentOptions[0].checked = true;
        appState.orderInfo.paymentMethod = paymentOptions[0].value;
        const firstFormId = `${paymentOptions[0].value}-form`;
        document.getElementById(firstFormId).style.display = 'block';
    }
    
    // Configurar o botão de copiar chave PIX
    const copyButton = document.querySelector('.copy-button');
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const pixKey = document.getElementById('pix-key-input');
            if (pixKey) {
                pixKey.select();
                document.execCommand('copy');
                showToast('Chave PIX copiada!');
            }
        });
    }
}

// Função para finalizar o pedido
function placeOrder() {
    // Validar informações de entrega
    const nameInput = document.getElementById('customer-name');
    const addressInput = document.getElementById('customer-address');
    const phoneInput = document.getElementById('customer-phone');
    
    if (!nameInput.value || !addressInput.value || !phoneInput.value) {
        showToast('Por favor, preencha todas as informações de entrega', 'error');
        return false;
    }
    
    // Salvar informações de entrega
    appState.orderInfo.name = nameInput.value;
    appState.orderInfo.address = addressInput.value;
    appState.orderInfo.phone = phoneInput.value;
    
    // Validar método de pagamento
    if (!appState.orderInfo.paymentMethod) {
        showToast('Por favor, selecione um método de pagamento', 'error');
        return false;
    }
    
    // Validar informações de cartão se for o método selecionado
    if (appState.orderInfo.paymentMethod === 'credit-card') {
        const cardNumberInput = document.getElementById('card-number');
        const cardNameInput = document.getElementById('card-name');
        const cardExpiryInput = document.getElementById('expiry-date');
        const cardCvvInput = document.getElementById('cvv');
        
        if (!cardNumberInput.value || !cardNameInput.value || !cardExpiryInput.value || !cardCvvInput.value) {
            showToast('Por favor, preencha todas as informações do cartão', 'error');
            return false;
        }
        
        // Salvar informações do cartão
        appState.orderInfo.cardInfo.number = cardNumberInput.value;
        appState.orderInfo.cardInfo.name = cardNameInput.value;
        appState.orderInfo.cardInfo.expiry = cardExpiryInput.value;
        appState.orderInfo.cardInfo.cvv = cardCvvInput.value;
    }
    
    // Gerar número do pedido
    appState.orderInfo.orderNumber = generateOrderNumber();
    
    // Calcular tempo estimado de entrega (30-45 minutos a partir de agora)
    const now = new Date();
    const estimatedTime = new Date(now.getTime() + (30 * 60 * 1000)); // 30 minutos
    appState.orderInfo.estimatedTime = estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Preparar a tela de confirmação
    prepareConfirmationScreen();
    
    // Navegar para a tela de confirmação
    navigateTo('confirmation-screen');
    
    // Limpar o carrinho
    appState.cart = [];
    updateCartCount();
    
    // Salvar o estado no localStorage
    saveToLocalStorage();
    
    return true;
}

function generateOrderNumber() {
    return 'PED' + Math.floor(100000 + Math.random() * 900000);
}

function prepareConfirmationScreen() {
    const orderNumberElement = document.querySelector('.order-number strong');
    const estimatedTimeElement = document.querySelector('.estimated-time strong');
    
    if (orderNumberElement) {
        orderNumberElement.textContent = appState.orderInfo.orderNumber;
    }
    
    if (estimatedTimeElement) {
        estimatedTimeElement.textContent = appState.orderInfo.estimatedTime;
    }
    
    // Atualizar os passos de rastreamento
    updateTrackingSteps();
}

function updateTrackingSteps() {
    const trackingSteps = document.querySelectorAll('.tracking-step');
    
    if (!trackingSteps.length) return;
    
    // Ativar o primeiro passo (Pedido Confirmado)
    trackingSteps[0].classList.add('active');
    
    // Simular atualizações de status
    setTimeout(() => {
        // Ativar o segundo passo (Preparando)
        if (trackingSteps[1]) trackingSteps[1].classList.add('active');
    }, 5000);
    
    setTimeout(() => {
        // Ativar o terceiro passo (Saiu para Entrega)
        if (trackingSteps[2]) trackingSteps[2].classList.add('active');
    }, 10000);
}

// Funções utilitárias
function showToast(message, type = 'success') {
    // Verificar se já existe um toast
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        // Criar um novo toast
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Definir a classe de tipo
    toast.className = `toast ${type}`;
    
    // Definir a mensagem
    toast.textContent = message;
    
    // Mostrar o toast
    toast.classList.add('show');
    
    // Esconder o toast após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function saveToLocalStorage() {
    localStorage.setItem('deliveryAppState', JSON.stringify({
        cart: appState.cart,
        currentScreen: appState.currentScreen,
        selectedCategory: appState.selectedCategory
    }));
}

function loadFromLocalStorage() {
    const savedState = localStorage.getItem('deliveryAppState');
    
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        if (parsedState.cart) appState.cart = parsedState.cart;
        if (parsedState.currentScreen) appState.currentScreen = parsedState.currentScreen;
        if (parsedState.selectedCategory) appState.selectedCategory = parsedState.selectedCategory;
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botão de finalizar pedido
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            navigateTo('payment-screen');
        });
    }
    
    // Botão de continuar comprando
    const continueShoppingButton = document.querySelector('.continue-shopping-btn');
    if (continueShoppingButton) {
        continueShoppingButton.addEventListener('click', () => {
            navigateTo('menu-screen');
        });
    }
    
    // Botão de voltar para o carrinho
    const backToCartButton = document.querySelector('.back-to-cart-btn');
    if (backToCartButton) {
        backToCartButton.addEventListener('click', () => {
            navigateTo('cart-screen');
        });
    }
    
    // Botão de finalizar pagamento
    const placeOrderButton = document.querySelector('.place-order-btn');
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', () => {
            placeOrder();
        });
    }
    
    // Botão de fazer novo pedido
    const newOrderButton = document.querySelector('.new-order-btn');
    if (newOrderButton) {
        newOrderButton.addEventListener('click', () => {
            navigateTo('home-screen');
        });
    }
    
    // Adicionar CSS para o toast
    addToastStyles();
}

function addToastStyles() {
    // Verificar se o estilo já existe
    if (document.getElementById('toast-styles')) return;
    
    // Criar elemento de estilo
    const style = document.createElement('style');
    style.id = 'toast-styles';
    
    // Definir o CSS
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: var(--success-color);
            color: white;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .toast.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        .toast.error {
            background-color: var(--danger-color);
        }
        
        .toast.warning {
            background-color: var(--warning-color);
            color: var(--text-color);
        }
    `;
    
    // Adicionar ao head
    document.head.appendChild(style);
}