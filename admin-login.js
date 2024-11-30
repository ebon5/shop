class AdminLogin {
    constructor() {
        // If already logged in as admin, redirect to admin panel
        if (localStorage.getItem('adminLoggedIn')) {
            window.location.href = 'admin.html';
            return;
        }

        this.adminCredentials = {
            username: 'admin',
            password: 'admin123'
        };
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const form = document.getElementById('adminLoginForm');
        form.addEventListener('submit', (e) => this.handleLogin(e));
    }

    handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');

        if (username === this.adminCredentials.username && 
            password === this.adminCredentials.password) {
            // Set admin session
            localStorage.setItem('adminLoggedIn', 'true');
            // Redirect to admin dashboard
            window.location.href = 'admin.html';
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Invalid username or password';
        }
    }
}

const adminLogin = new AdminLogin();