const toastContainer = document.getElementById('toastContainer');
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const sortBy = document.getElementById('sortBy');
const pagination = document.getElementById('pagination');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');

const apiUrl = 'http://localhost:5000/api';
const token = localStorage.getItem('taskflow_token');
let currentPage = 1;
let currentSearch = '';
let currentStatus = '';
let currentSort = 'createdAt';
const limit = 6;

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

const handleLogout = () => {
    localStorage.removeItem('taskflow_user');
    localStorage.removeItem('taskflow_token');
    window.location.href = 'login.html';
};

const renderTasks = (tasks) => {
    taskList.innerHTML = '';
    if (!tasks.length) {
        taskList.innerHTML = '<p class="text-muted">No tasks found. Create your first task.</p>';
        return;
    }

    tasks.forEach((task) => {
        const taskEl = document.createElement('article');
        taskEl.className = 'task-card';
        taskEl.innerHTML = `
      <div class="d-flex justify-content-between align-items-start gap-3">
        <div>
          <h3>${task.title}</h3>
          <p class="text-muted mb-2">${task.description || 'No description provided'}</p>
        </div>
        <div class="text-end">
          <span class="badge ${task.status === 'completed' ? 'bg-success' : task.status === 'in-progress' ? 'bg-warning text-dark' : 'bg-secondary'}">${task.status}</span>
          <span class="badge bg-info ms-1">${task.priority}</span>
        </div>
      </div>
      <div class="task-meta">
        <span><i class="fa-solid fa-calendar-days me-2"></i>${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
        <span><i class="fa-solid fa-clock me-2"></i>${new Date(task.createdAt).toLocaleDateString()}</span>
      </div>
      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-sm btn-outline-light btn-edit" data-id="${task._id}">Edit</button>
        <button class="btn btn-sm btn-danger btn-delete" data-id="${task._id}">Delete</button>
      </div>
    `;

        taskList.appendChild(taskEl);
    });

    document.querySelectorAll('.btn-delete').forEach((button) => {
        button.addEventListener('click', async () => {
            const id = button.dataset.id;
            try {
                const response = await fetch(`${apiUrl}/tasks/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (!response.ok) {
                    createToast(data.message || 'Unable to delete task', 'danger');
                    return;
                }
                createToast(data.message, 'success');
                loadTasks();
            } catch (error) {
                createToast('Could not delete task', 'danger');
            }
        });
    });
};

const renderPagination = (total, page) => {
    const pages = Math.ceil(total / limit);
    pagination.innerHTML = '';
    if (pages <= 1) return;

    for (let i = 1; i <= pages; i += 1) {
        const li = document.createElement('li');
        li.className = `page-item ${i === page ? 'active' : ''}`;
        li.innerHTML = `<button class="page-link">${i}</button>`;
        li.addEventListener('click', () => {
            currentPage = i;
            loadTasks();
        });
        pagination.appendChild(li);
    }
};

const loadTasks = async () => {
    try {
        taskList.innerHTML = '<div class="loader"></div>';
        const query = new URLSearchParams({
            page: currentPage,
            limit,
            search: currentSearch,
            status: currentStatus,
            sort: currentSort,
        });
        const response = await fetch(`${apiUrl}/tasks?${query.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
            createToast(data.message || 'Unable to load tasks', 'danger');
            taskList.innerHTML = '<p class="text-muted">Could not load tasks.</p>';
            return;
        }

        renderTasks(data.tasks);
        renderPagination(data.total, data.page);
    } catch (error) {
        createToast('Could not connect to server', 'danger');
        taskList.innerHTML = '<p class="text-muted">Could not connect to server.</p>';
    }
};

const loadUserProfile = () => {
    const user = JSON.parse(localStorage.getItem('taskflow_user')) || { name: 'User' };
    userName.textContent = user.name;
};

if (!token) {
    window.location.href = 'login.html';
}

loadUserProfile();
loadTasks();

taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const status = document.getElementById('taskStatus').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;

    if (!title) {
        createToast('Task title is required', 'danger');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, status, priority, dueDate }),
        });
        const data = await response.json();
        if (!response.ok) {
            createToast(data.message || 'Failed to create task', 'danger');
            return;
        }

        createToast('Task created successfully', 'success');
        taskForm.reset();
        loadTasks();
    } catch (error) {
        createToast('Could not create task', 'danger');
    }
});

searchInput.addEventListener('input', () => {
    currentSearch = searchInput.value.trim();
    currentPage = 1;
    loadTasks();
});

filterStatus.addEventListener('change', () => {
    currentStatus = filterStatus.value;
    currentPage = 1;
    loadTasks();
});

sortBy.addEventListener('change', () => {
    currentSort = sortBy.value;
    loadTasks();
});

logoutBtn.addEventListener('click', handleLogout);
