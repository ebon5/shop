class OrderHistory {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('allOrders')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.init();
    }

    init() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        console.log('Current User:', this.currentUser);
        console.log('All Orders:', this.orders);
        
        this.updateAuthButtons();
        this.displayOrders();
    }

    displayOrders() {
        const orderHistoryContent = document.getElementById('orderHistoryContent');
        
        const userOrders = this.orders.filter(order => 
            order.userEmail === this.currentUser.email
        ).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
        
        if (userOrders.length === 0) {
            orderHistoryContent.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-shopping-bag"></i>
                    <h2>No Orders Yet</h2>
                    <p>Looks like you haven't placed any orders yet.</p>
                    <a href="index.html" class="continue-shopping">
                        <i class="fas fa-arrow-left"></i> Start Shopping
                    </a>
                </div>
            `;
            return;
        }

        orderHistoryContent.innerHTML = userOrders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">#${order.orderId}</div>
                        <div class="order-date">
                            <i class="far fa-calendar-alt"></i>
                            ${new Date(order.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                    <div class="order-status ${order.status.toLowerCase()}">
                        <i class="fas fa-circle"></i> ${order.status}
                    </div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="item-image">
                            <div class="item-details">
                                <div class="item-name">${item.name}</div>
                                <div class="item-quantity">Quantity: ${item.quantity}</div>
                                <div class="item-price">Price: BDT ${item.price.toFixed(2)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <div class="total-amount">Total: BDT ${order.total.toFixed(2)}</div>
                </div>
            </div>
        `).join('');
    }

    updateAuthButtons() {
        const authButtons = document.querySelector('.auth-buttons');
        if (this.currentUser) {
            authButtons.innerHTML = `
                <div class="user-welcome">
                    <i class="fas fa-user"></i>
                    <span>Welcome, ${this.currentUser.name}</span>
                </div>
                <button class="auth-btn" onclick="orderHistory.logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            `;
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

const orderHistory = new OrderHistory();
