class AdminPanel {
    constructor() {
        // Check if we're on an admin page
        if (window.location.pathname.includes('admin.html')) {
            // Only check admin login if we're on the admin page
            if (!localStorage.getItem('adminLoggedIn')) {
                window.location.href = 'admin-login.html';
                return;
            }
        }
        
        this.orders = JSON.parse(localStorage.getItem('allOrders')) || [];
        console.log('Loaded orders:', this.orders);
        
        this.initializeEventListeners();
        this.updateDashboardStats();
        this.displayOrders();
    }

    initializeEventListeners() {
        document.getElementById('searchInput').addEventListener('input', () => this.filterOrders());
        document.getElementById('dateFilter').addEventListener('change', () => this.filterOrders());
        document.getElementById('statusFilter').addEventListener('change', () => this.filterOrders());

        // Modal close button
        const modal = document.getElementById('orderModal');
        const closeBtn = document.getElementsByClassName('close')[0];
        closeBtn.onclick = () => modal.style.display = "none";
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    }

    updateDashboardStats() {
        // Total Orders
        document.getElementById('totalOrders').textContent = this.orders.length;

        // Today's Orders
        const today = new Date().toDateString();
        const todayOrders = this.orders.filter(order => 
            new Date(order.date).toDateString() === today
        ).length;
        document.getElementById('todayOrders').textContent = todayOrders;

        // Total Revenue
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);
        document.getElementById('totalRevenue').textContent = 'BDT ' + totalRevenue.toFixed(2);

        // Average Order Value
        const avgOrderValue = this.orders.length > 0 ? totalRevenue / this.orders.length : 0;
        document.getElementById('avgOrderValue').textContent = 'BDT ' + avgOrderValue.toFixed(2);
    }

    displayOrders(ordersToDisplay = this.orders) {
        const tableBody = document.getElementById('ordersTableBody');
        
        if (ordersToDisplay.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem;">
                        No orders found
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = ordersToDisplay.map(order => `
            <tr>
                <td>${order.orderId || 'N/A'}</td>
                <td>${new Date(order.date).toLocaleString()}</td>
                <td>${order.customerName || order.userName || 'N/A'}</td>
                <td>BDT ${order.total.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${order.status?.toLowerCase() || 'pending'}">
                        ${order.status || 'Pending'}
                    </span>
                </td>
                <td>
                    <button onclick="adminPanel.viewOrder('${order.orderId}')" class="action-btn view-btn">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${order.status !== 'confirmed' ? `
                        <button onclick="adminPanel.confirmOrder('${order.orderId}')" class="action-btn confirm-btn">
                            <i class="fas fa-check"></i> Confirm
                        </button>
                    ` : ''}
                    ${order.status !== 'cancelled' ? `
                        <button onclick="adminPanel.cancelOrder('${order.orderId}')" class="action-btn cancel-btn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);
        if (!order) return;

        const modal = document.getElementById('orderModal');
        const orderDetails = document.getElementById('orderDetails');

        orderDetails.innerHTML = `
            <h2 style="margin-bottom: 1.5rem; color: #333;">Order Details</h2>
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <h3 style="color: #c00600; margin-bottom: 1rem;">Order Information</h3>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                <p><strong>Status:</strong> 
                    <span class="status-badge status-${order.status?.toLowerCase() || 'pending'}">
                        ${order.status || 'Pending'}
                    </span>
                </p>
            </div>

            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <h3 style="color: #c00600; margin-bottom: 1rem;">Customer Information</h3>
                <p><strong>Name:</strong> ${order.customerName || order.userName}</p>
                <p><strong>Email:</strong> ${order.email || order.userEmail}</p>
                <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
            </div>

            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <h3 style="color: #c00600; margin-bottom: 1rem;">Payment Information</h3>
                <p><strong>bKash Number:</strong> ${order.bkashNumber || 'N/A'}</p>
                <p><strong>Transaction ID:</strong> ${order.transactionId || 'N/A'}</p>
            </div>

            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <h3 style="color: #c00600; margin-bottom: 1rem;">Order Items</h3>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;">
                            <div>
                                <strong>${item.name}</strong> x ${item.quantity}
                            </div>
                            <div>
                                BDT ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    `).join('')}
                    <div style="margin-top: 1rem; text-align: right; font-weight: bold; color: #c00600;">
                        Total Amount: BDT ${order.total.toFixed(2)}
                    </div>
                </div>
            </div>
        `;

        modal.style.display = "block";
    }

    filterOrders() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const dateFilter = document.getElementById('dateFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        let filteredOrders = this.orders;

        if (searchTerm) {
            filteredOrders = filteredOrders.filter(order => 
                (order.orderId || '').toLowerCase().includes(searchTerm) ||
                (order.customerName || order.userName || '').toLowerCase().includes(searchTerm) ||
                (order.email || order.userEmail || '').toLowerCase().includes(searchTerm)
            );
        }

        if (dateFilter) {
            const filterDate = new Date(dateFilter).toDateString();
            filteredOrders = filteredOrders.filter(order => 
                new Date(order.date).toDateString() === filterDate
            );
        }

        if (statusFilter !== 'all') {
            filteredOrders = filteredOrders.filter(order => 
                (order.status || 'pending').toLowerCase() === statusFilter.toLowerCase()
            );
        }

        this.displayOrders(filteredOrders);
    }

    confirmOrder(orderId) {
        this.updateOrderStatus(orderId, 'confirmed');
    }

    cancelOrder(orderId) {
        this.updateOrderStatus(orderId, 'cancelled');
    }

    updateOrderStatus(orderId, status) {
        const orderIndex = this.orders.findIndex(o => o.orderId === orderId);
        if (orderIndex === -1) return;

        this.orders[orderIndex].status = status;
        localStorage.setItem('allOrders', JSON.stringify(this.orders));
        this.displayOrders();
        this.updateDashboardStats();
    }

    logout() {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    }
}

// Initialize admin panel
const adminPanel = new AdminPanel();
