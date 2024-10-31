const data = document.getElementById("agendarForm");

const handleScheduleClass = async (e) => {
  e.preventDefault();

  const nome = e.target.nome.value;
  const telefone = e.target.telefone.value;
  const email = e.target.email.value;

  const data = { nome, telefone, email };

  try {
    await fetch("http://localhost:8000/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    alert("Cadastro realizado com sucesso!");
  } catch (error) {
    console.log("error: ", error);
    alert("Erro ao realizar cadastro. Por favor, tente novamente.");
  }

  e.target.reset();
};

data.addEventListener("submit", handleScheduleClass);
