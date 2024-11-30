// checkout
class CheckoutSystem {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!this.currentUser) {
            alert('Please login to checkout');
            window.location.href = 'login.html';
            return;
        }
        
        if (!this.cart.length) {
            alert('Your cart is empty');
            window.location.href = 'cart.html';
            return;
        }

        this.displayOrderSummary();
        this.initializeForm();
    }

    displayOrderSummary() {
        const orderItems = document.getElementById('orderItems');
        const totalAmount = document.getElementById('totalAmount');
        
        orderItems.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>BDT ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = total.toFixed(2);
    }

    initializeForm() {
        const form = document.getElementById('checkoutForm');
        const emailInput = document.getElementById('email');
        
        // Pre-fill email with user's email
        emailInput.value = this.currentUser.email;
        
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(event) {
        event.preventDefault();

        // Create order object
        const order = {
            orderId: 'ORD' + Date.now(),
            userEmail: this.currentUser.email,
            userName: this.currentUser.name,
            date: new Date().toISOString(),
            customerName: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            bkashNumber: document.getElementById('bkashNumber').value,
            transactionId: document.getElementById('transactionId').value,
            items: [...this.cart], // Create a copy of cart items
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'Processing'
        };

        // Get existing orders
        let allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
        
        // Add new order
        allOrders.push(order);
        
        // Save to localStorage
        localStorage.setItem('allOrders', JSON.stringify(allOrders));

        // Clear cart
        localStorage.removeItem('cart');

        // Show success message
        alert('Order placed successfully! Thank you for shopping with us.');
        
        // Redirect to order history
        window.location.href = 'order-history.html';
    }
}

// Initialize checkout system
const checkoutSystem = new CheckoutSystem();