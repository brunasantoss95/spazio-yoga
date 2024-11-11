/* CODIGO QUE ESTAVA ANTES 10/11/2024
const clientsList = document.querySelector('[data-element="clientsList"]');

try {
  const response = await fetch("http://localhost:8000/admin/users");
  const users = response.json();

  users.forEach((user) => {
    clientsList.innerHTML += `<p>${user.nome} - ${user.email} - ${user.telefone}</p>`;
  });
} catch (error) {
  console.log(error);
}*/

//CÓDIGO DA IA

// Verifica se o usuário está autenticado
const checkAuth = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/adminLogin.html';
    return false;
  }
  return true;
};

// Elementos do DOM
const dashboardEl = {
  usersList: document.querySelector('[data-element="usersList"]'),
  logoutBtn: document.querySelector('[data-element="logoutBtn"]'),
  searchInput: document.querySelector('[data-element="searchInput"]'),
  totalUsers: document.querySelector('[data-element="totalUsers"]'),
};

// Estado da aplicação
let users = [];
let filteredUsers = [];

// Formata data para exibição
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Renderiza lista de usuários
const renderUsers = (usersList = []) => {
  if (!dashboardEl.usersList) return;
  
  dashboardEl.usersList.innerHTML = usersList.length ? usersList.map(user => `
    <tr class="border-b hover:bg-gray-50">
      <td class="px-4 py-3">${user.nome || ''}</td>
      <td class="px-4 py-3">${user.email || ''}</td>
      <td class="px-4 py-3">${user.telefone || ''}</td>
      <td class="px-4 py-3">${formatDate(user.dataCadastro || new Date())}</td>
    </tr>
  `).join('') : `
    <tr>
      <td colspan="4" class="px-4 py-3 text-center text-gray-500">
        Nenhum cadastro encontrado
      </td>
    </tr>
  `;

  // Atualiza contador de usuários
  if (dashboardEl.totalUsers) {
    dashboardEl.totalUsers.textContent = usersList.length;
  }
};

// Busca usuários
const searchUsers = (searchTerm) => {
  filteredUsers = users.filter(user => 
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telefone?.includes(searchTerm)
  );
  renderUsers(filteredUsers);
};

// Carrega dados dos usuários
const loadUsers = async () => {
  try {
    const response = await fetch('http://localhost:8000/admin/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar usuários');
    }

    users = await response.json();
    filteredUsers = [...users];
    renderUsers(users);
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    alert('Erro ao carregar lista de usuários. Por favor, tente novamente.');
  }
};

// Event Listeners
const initDashboard = () => {
  if (!checkAuth()) return;

  // Carrega dados iniciais
  loadUsers();

  // Configura busca
  if (dashboardEl.searchInput) {
    dashboardEl.searchInput.addEventListener('input', (e) => {
      searchUsers(e.target.value);
    });
  }

  // Configura logout
  if (dashboardEl.logoutBtn) {
    dashboardEl.logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminToken');
      window.location.href = '/adminLogin.html';
    });
  }
};

// Inicializa dashboard
document.addEventListener('DOMContentLoaded', initDashboard);
