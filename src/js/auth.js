document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout-button');
    const adminLink = document.getElementById('admin-link');
    const loginRegisterSection = document.getElementById('login-register');
    const userDashboardSection = document.getElementById('user-dashboard');
    const userNameSpan = document.getElementById('user-name');
    const availableClassesList = document.getElementById('available-classes');
    const userClassesList = document.getElementById('user-classes');

    const API_URL = 'http://localhost:3000';

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('currentUser', username);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('isAdmin', data.isAdmin);
                    window.location.reload();
                } else {
                    alert('Login falhou. Verifique seu nome de usuário e senha.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Erro ao fazer login. Tente novamente.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();
                if (data.id) {
                    alert('Registro bem-sucedido! Agora você pode fazer login.');
                    document.querySelector('[data-tab="login"]').click();
                } else {
                    alert('Registro falhou. Nome de usuário já existe.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Erro ao registrar. Tente novamente.');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userId');
            localStorage.removeItem('isAdmin');
            window.location.reload();
        });
    }

    const currentUser = localStorage.getItem('currentUser');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (currentUser) {
        if (loginRegisterSection) loginRegisterSection.style.display = 'none';
        if (userDashboardSection) userDashboardSection.style.display = 'block';
        if (userNameSpan) userNameSpan.textContent = currentUser;
        if (isAdmin && adminLink) adminLink.style.display = 'inline';
        updateAvailableClasses();
        updateUserClasses();
    }

    async function updateAvailableClasses() {
        try {
            const response = await fetch(`${API_URL}/classes`);
            const classes = await response.json();
            console.log(classes);
            availableClassesList.innerHTML = '';
            classes.forEach(cls => {
                const li = document.createElement('li');
                li.textContent = `${cls.name} - Data/Hora: ${cls.datetime} - Vagas: ${cls.max_students}`;
                const enrollButton = document.createElement('button');
                enrollButton.textContent = 'Inscrever-se';
                enrollButton.addEventListener('click', () => enrollInClass(cls.id));
                li.appendChild(enrollButton);
                availableClassesList.appendChild(li);
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao buscar aulas disponíveis. Tente novamente.');
        }
    }

    async function updateUserClasses() {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`${API_URL}/enrollments/${userId}`);
            const classes = await response.json();
            userClassesList.innerHTML = '';
            classes.forEach(cls => {
                const li = document.createElement('li');
                li.textContent = `${cls.name} - Data/Hora: ${cls.datetime}`;
                userClassesList.appendChild(li);
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao buscar suas aulas. Tente novamente.');
        }
    }

    async function enrollInClass(classId) {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`${API_URL}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, classId }),
            });
            const data = await response.json();
            if (data.id) {
                alert('Inscrição realizada com sucesso!');
                updateAvailableClasses();
                updateUserClasses();
            } else {
                alert('Falha ao se inscrever na aula. Tente novamente.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao se inscrever na aula. Tente novamente.');
        }
    }
});