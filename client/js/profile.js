const toastContainer = document.getElementById('toastContainer');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileRole = document.getElementById('profileRole');
const logoutBtn = document.getElementById('logoutBtn');

const apiUrl = 'http://localhost:5000/api';
const token = localStorage.getItem('taskflow_token');

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

const loadProfile = async () => {
    if (!token) {
        window.location.href = 'login.html';
    }

    try {
        const response = await fetch(`${apiUrl}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
            createToast(data.message || 'Unable to load profile', 'danger');
            return;
        }

        profileName.textContent = data.user.name;
        profileEmail.textContent = data.user.email;
        profileRole.textContent = data.user.role;
    } catch (error) {
        createToast('Could not connect to server', 'danger');
    }
};

const handleLogout = () => {
    localStorage.removeItem('taskflow_user');
    localStorage.removeItem('taskflow_token');
    window.location.href = 'login.html';
};

logoutBtn.addEventListener('click', handleLogout);
loadProfile();
