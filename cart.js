class CartSystem {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
        this.initializeListeners();
    }
//Event Listener Initialization
    initializeListeners() {
        // Add to cart button listeners
        document.querySelectorAll('.product-card').forEach(card => {
            const addButton = card.querySelector('button');
            addButton.addEventListener('click', () => {
                const product = {
                    id: card.querySelector('.product-title').id,
                    name: card.querySelector('.product-title').textContent,
                    price: parseFloat(card.querySelector('p').textContent.replace('BDT', '')),
                    image: card.querySelector('.product-image').src
                };
                this.addToCart(product);
            });
        });

        // Cart icon listener
        document.querySelector('.cart').addEventListener('click', this.showCartModal.bind(this));
    }
//Adding Items to Cart
    addToCart(product) {
        const productId = String(product.id);
        
        // Find existing item using strict equality
        const existingItemIndex = this.cart.findIndex(item => String(item.id) === productId);
        
        if (existingItemIndex !== -1) {
            // Update existing item quantity
            this.cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item with all properties and quantity of 1
            const newItem = {
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            };
            this.cart.push(newItem);
        }
        
        this.saveCart();
        this.updateCartCount();
    }

    removeFromCart(productId) {
        // Convert productId to string for consistent comparison
        const id = String(productId);
        this.cart = this.cart.filter(item => String(item.id) !== id);
        this.saveCart();
        this.updateCartCount();
        this.updateCartModal();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    showCartModal() {
        const modal = document.getElementById('cartModal') || this.createCartModal();
        this.updateCartModal();
        modal.style.display = 'block';
    }

    createCartModal() {
        const modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Shopping Cart</h2>
                <div id="cartItems"></div>
                <div class="cart-total">
                    <h3>Total: BDT <span id="cartTotal">0</span></h3>
                    <button id="checkoutBtn" onclick="window.location.href='checkout.html'">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close').onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        return modal;
    }

    updateCartModal() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>BDT ${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="cartSystem.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="cartSystem.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="cartSystem.removeFromCart('${item.id}')">×</button>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    updateQuantity(productId, newQuantity) {
        // Convert productId to string for consistent comparison
        const id = String(productId);
        if (newQuantity < 1) {
            this.removeFromCart(id);
            return;
        }

        const item = this.cart.find(item => String(item.id) === id);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartCount();
            this.updateCartModal();
        }
    }

    checkout() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            alert('Please login to checkout');
            return;
        }

        if (this.cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Calculate total
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order object with more details
        const order = {
            orderId: 'ORD' + Date.now(), // Unique order ID using timestamp
            userEmail: currentUser.email,
            userName: currentUser.name,
            date: new Date().toISOString(),
            items: [...this.cart],
            total: total,
            status: 'Processing'
        };

        // Get existing orders or initialize empty array
        let allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
        
        // Add new order
        allOrders.push(order);
        
        // Save to localStorage
        localStorage.setItem('allOrders', JSON.stringify(allOrders));

        // Clear the cart
        this.cart = [];
        this.saveCart();

        // Show success message
        alert('Order placed successfully!');
        
        // Redirect to order history page
        window.location.href = 'order-history.html';
    }
}

// Initialize cart system
const cartSystem = new CartSystem();