const adminRegisterForm = document.querySelector(
  '[data-element="adminRegisterForm"]'
);

const handleAdminRegister = async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  const data = { email, password };

  try {
    await fetch("http://localhost:8000/admin/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    alert("Administrador cadastrado com sucesso!");
  } catch (error) {
    console.log(error);
    alert("Cadastro falhou!");
  }

  e.target.reset();
};

adminRegisterForm.addEventListener("submit", handleAdminRegister);
