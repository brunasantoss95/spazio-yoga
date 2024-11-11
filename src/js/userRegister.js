//ARQUIVO CRIADO POR SUGESTÃP DA IA

// Elementos do DOM
const formEl = document.querySelector('[data-element="agendarForm"]');

// Validação básica de campos
const validateForm = (formData) => {
  const errors = [];
  
  if (!formData.nome || formData.nome.length < 3) {
    errors.push('Nome deve ter pelo menos 3 caracteres');
  }
  
  if (!formData.email || !formData.email.includes('@')) {
    errors.push('Email inválido');
  }
  
  if (!formData.telefone || formData.telefone.replace(/\D/g, '').length < 10) {
    errors.push('Telefone inválido');
  }
  
  return errors;
};

// Handler do formulário
const handleFormSubmit = async (e) => {
  e.preventDefault();
  
  const formData = {
    nome: e.target.nome.value.trim(),
    email: e.target.email.value.trim(),
    telefone: e.target.telefone.value.trim(),
    dataCadastro: new Date().toISOString()
  };
  
  // Valida campos
  const errors = validateForm(formData);
  if (errors.length > 0) {
    alert(errors.join('\n'));
    return;
  }
  
  try {
    const response = await fetch('http://localhost:8000/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error('Falha ao realizar cadastro');
    }
    
    alert('Cadastro realizado com sucesso!');
    e.target.reset();
    
  } catch (error) {
    console.error('Erro no cadastro:', error);
    alert('Erro ao realizar cadastro. Por favor, tente novamente.');
  }
};

// Inicializa form
if (formEl) {
  formEl.addEventListener('submit', handleFormSubmit);
}