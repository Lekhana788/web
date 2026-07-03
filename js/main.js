const toggleThemeButtons = document.querySelectorAll('#toggleTheme');
const pageShell = document.querySelector('.page-shell');

const applyTheme = (theme) => {
    if (!pageShell) return;

    if (theme === 'dark') {
        document.body.classList.add('page-dark');
        document.body.classList.remove('page-light');
        pageShell.classList.add('page-dark');
        pageShell.classList.remove('page-light');
    } else {
        document.body.classList.add('page-light');
        document.body.classList.remove('page-dark');
        pageShell.classList.add('page-light');
        pageShell.classList.remove('page-dark');
    }
};

const updateThemeIcons = () => {
    toggleThemeButtons.forEach((button) => {
        const icon = button.querySelector('i');
        if (!icon) return;
        if (document.body.classList.contains('page-dark')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
};

const storedTheme = localStorage.getItem('theme') || 'light';
applyTheme(storedTheme);
updateThemeIcons();

toggleThemeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const nextTheme = pageShell.classList.contains('page-dark') ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
        updateThemeIcons();
    });
