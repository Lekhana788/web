const toastContainer = document.getElementById('toastContainer');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

const apiUrl = 'http://localhost:5000/api';

const createToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white border-0 show bg-${type}`;
    toast.role = 'alert';
    toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
    </div>
  `;
    toastContainer.appendChild(toast);
    toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());
    setTimeout(() => toast.remove(), 4000);
};

const saveUserSession = (user, token) => {
    localStorage.setItem('taskflow_user', JSON.stringify(user));
    localStorage.setItem('taskflow_token', token);
};

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!name || !email || !password) {
            createToast('Please complete all fields', 'danger');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                createToast(data.message || 'Registration failed', 'danger');
                return;
            }

            saveUserSession(data.user, data.token);
            createToast('Registration successful!', 'success');
            window.location.href = 'dashboard.html';
        } catch (error) {
            createToast('Unable to register. Try again later.', 'danger');
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            createToast('Email and password are required', 'danger');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                createToast(data.message || 'Login failed', 'danger');
                return;
            }

            saveUserSession(data.user, data.token);
            createToast('Login successful!', 'success');
            window.location.href = 'dashboard.html';
        } catch (error) {
            createToast('Unable to login. Try again later.', 'danger');
        }
    });
}
