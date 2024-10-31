const clientsList = document.querySelector('[data-element="clientsList"]');

try {
  const response = await fetch("http://localhost:8000/admin/users");
  const users = response.json();

  users.forEach((user) => {
    clientsList.innerHTML += `<p>${user.nome} - ${user.email} - ${user.telefone}</p>`;
  });
} catch (error) {
  console.log(error);
}
